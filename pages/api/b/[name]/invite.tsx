import {PrismaAdapter} from '@next-auth/prisma-adapter'
import {InvitationType} from '@prisma/client'
import {getProviders, getSession} from "next-auth/react"
import {emailConfig} from '../../../api/auth/[...nextauth]'
import nodemailer from "nodemailer"
import _crypto from "crypto";
import prisma from '../../../../components/util/prismaClient'

const adapter = PrismaAdapter(prisma)

// From https://next-auth.js.org/providers/email#configuration
// Maybe we could create a custom provider out of all this?
async function sendVerificationRequest({
            email,
            url,
            provider: {server, from},
}) {
    const site = process.env.NEXTAUTH_URL
    const transport = nodemailer.createTransport(server)
    await transport.sendMail({
        to: email,
        from,
        subject: `Sign in to ${site}`,
        text: text({url, site}),
        html: html({url, site, email}),
    })
}

export default async function handler(req, res) {

    // Check request and params

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    const biotopeName = req.query.name;
    const email = req.body?.email

    if (!email) {
        return res.status(400).send({ message: 'Invalid POST request' })
    }

    // Check config
    // Requires EmailProvider for the callbackUrl
    // Requires EmailConfig for generating token, smtp config

    const providers = await getProviders()
    const emailProvider = providers.email

    if (!emailProvider || !emailConfig) {
        console.log('EmailProvider', emailProvider)
        console.log('EmailConfig', emailConfig)
        res.status(500).send({ message: 'Invalid server configuration'})
        return
    }

    const session = await getSession({ req })
    if (!session) {
        return res.status(401).json(new Error("Who are you?"))
    }
    // @ts-ignore
    const userId = session.user.id

    const callbackUrl = emailProvider.callbackUrl

    // From node_modules/next-auth/server/lib/email/signin.js

    const ONE_DAY_IN_SECONDS = 86400;
    const expires = new Date(Date.now() + ONE_DAY_IN_SECONDS * 1000);   // TODO: Configurable param?

    const token = await emailConfig.generateVerificationToken()
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

    try {

        const b = await prisma.cercle.findUnique({
            where: {
                name: biotopeName
            }
        })

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
                // TODO Should modify createdOn?
            },
            create: {
                type: InvitationType.EMAIL,
                cercleId: b.id,
                invitedEmail: email,
                creatorId: userId,
            }
        })

    } catch (error) {
        console.error("TOKE_TO_INVITATION_ERROR", {
            cercle: biotopeName,
            identifier: email,
            error
        });
        throw error;
    }

    const params = new URLSearchParams({
        callbackUrl: process.env.NEXTAUTH_URL,  // TODO: Should redirect to biotope's welcome page for invited users
        token,
        email,
    })
    const url = `${callbackUrl}?${params}`;

    try {

        await sendVerificationRequest({
            email,
            url,
            provider: emailConfig
        });

    } catch (error) {
        console.error("SEND_VERIFICATION_EMAIL_ERROR", {
            identifier: email,
            url,
            error
        });
        throw new Error("SEND_VERIFICATION_EMAIL_ERROR");
    }

    res.status(200).json(result)

}

// Email HTML body
const html = ({ url, site, email }) => {
    // Insert invisible space into domains and email address to prevent both the
    // email address and the domain from being turned into a hyperlink by email
    // clients like Outlook and Apple mail, as this is confusing because it seems
    // like they are supposed to click on their email address to sign in.
    const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`
    const escapedSite = `${site.replace(/\./g, "&#8203;.")}`

    // Some simple styling options
    const backgroundColor = "#f9f9f9"
    const textColor = "#444444"
    const mainBackgroundColor = "#ffffff"
    const buttonBackgroundColor = "#346df1"
    const buttonBorderColor = "#346df1"
    const buttonTextColor = "#ffffff"

    return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${escapedSite}</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Sign in as <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; text-decoration: none;border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
const text = ({ url, site }) => `Sign in to ${site}\n${url}\n\n`