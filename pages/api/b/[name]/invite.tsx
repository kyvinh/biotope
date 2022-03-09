import {InvitationType} from '@prisma/client'
import {getProviders} from "next-auth/react"
import _crypto from "crypto";
import prisma from '../../../../lib/prismaClient'
import {prismaAdapter} from "../../../../lib/prismaAdapter";
import {sendInvitationEmail} from '../../../../lib/invitationEmailProvider';
import {HasUserIdAuthGuard, internalServerErrorLogger} from "../../../../lib/serverAnnotations";
import {Body, Catch, createHandler, Post, Query} from "@storyofams/next-api-decorators";
import {ANON_EMAIL_DOMAIN, baseEmailConfig} from '../../../../lib/constants';

const adapter = prismaAdapter

@Catch(internalServerErrorLogger)
@HasUserIdAuthGuard()
class EmailInvitationHandler {
    @Post()
    async invite(@Body() {email, inviterName}:{email: string, inviterName: string}, @Query('name') biotopeName: string, @Query('userId') userId: string) {

        // Check config

        const { email: emailProvider} = await getProviders()   // Requires EmailProvider for the callbackUrl

        if (!email || !emailProvider || !baseEmailConfig) {
            console.log('EmailProvider', emailProvider)
            console.log('EmailConfig', baseEmailConfig) // Requires baseEmailConfig for generating token and smtp config
            throw Error('EmailInvitationHandler: Invalid server configuration')
        }
        const callbackUrl = emailProvider.callbackUrl

        // Create token
        // From node_modules/next-auth/server/lib/email/signin.js

        const EmailInvitationExpiration = 14 * 24 * 60 * 60 // 14 days in seconds for Email Invitation;
        const expires = new Date(Date.now() + EmailInvitationExpiration * 1000);

        const token = await baseEmailConfig.generateVerificationToken()
        const hashToken = _crypto.createHash("sha256")
            .update(`${token}${process.env.NEXTAUTH_SECRET}`)
            .digest("hex");

        let result;

        try {

            result = await adapter.createVerificationToken({
                identifier: email,
                expires: expires,
                token: hashToken
            })

        } catch (error) {
            if (error.code === "P2002" && error.meta.target === "VerificationToken_token_key") {
                console.log("Could not create a verification token the email already exists... maybe just ignore this?", error)
            } else {
                console.log("Could not create/send a verification token.", error)
            }
            throw new Error("Could not create VerificationToken");
        }

        // Create invitation

        let biotopeLongName = null;

        try {

            const b = await prisma.cercle.findUnique({
                where: {
                    name: biotopeName
                },
                rejectOnNotFound: true,
            })
            biotopeLongName = b.longName

            await prisma.invitation.upsert({
                where: {
                    type_invitedEmail_creatorId_cercleId: {
                        type: InvitationType.EMAIL,
                        cercleId: b.id,
                        invitedEmail: email,
                        creatorId: userId
                    }
                },
                update: {
                    createdOn: new Date()
                },
                create: {
                    type: InvitationType.EMAIL,
                    cercleId: b.id,
                    invitedEmail: email,
                    creatorId: userId,
                }
            })

        } catch (error) {
            console.error("TOKEN_TO_INVITATION_ERROR", {
                cercle: biotopeName,
                identifier: email,
                error
            });
            throw error;
        }

        // Send email

        const inviter = await prisma.user.findUnique({
            where: { id: userId },
            rejectOnNotFound: true,
        })

        const params = new URLSearchParams({
            callbackUrl: `${process.env.NEXTAUTH_URL}/b/${biotopeName}`,
            token,
            email,
        })
        const url = `${callbackUrl}?${params}`;

        try {

            await sendInvitationEmail({
                provider: baseEmailConfig,
                emailRefData: {
                    biotopeName: biotopeLongName,
                    inviterEmail: inviter.email.endsWith(ANON_EMAIL_DOMAIN) ? null : inviter.email,
                    inviterName: inviterName,
                    invitedEmail: email,
                    callbackUrl: url,
                }
            });

        } catch (error) {
            console.error("SEND_VERIFICATION_EMAIL_ERROR", {
                identifier: email,
                url,
                error
            });
            throw new Error("SEND_VERIFICATION_EMAIL_ERROR");
        }

        return { status: 'ok', token: result }
    }
}

export default createHandler(EmailInvitationHandler);