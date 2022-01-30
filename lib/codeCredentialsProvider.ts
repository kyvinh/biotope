import {CODE_LENGTH} from "../pages/api/b/[name]/createCode";
import prisma from "./prismaClient";
import {ActionType, InvitationType} from "@prisma/client";
import {hashUid} from "./user";
import {ANON_EMAIL_DOMAIN} from "./constants";

export const CodeCredentialsProviderConfig = {
    // From: https://github.com/mbarton/docs/blob/mbarton/anon-sessions/docs/tutorials/anonymous-sessions.md
    id: "code-credentials",
    name: "Invitation Code",
    credentials: {
        code: {label: "Code", type: "text"}
    },
    async authorize(credentials) {
        // noinspection JSUnresolvedVariable
        const code = credentials.code
        if (code?.length !== CODE_LENGTH) {
            throw new Error("Invalid invitation code")
        }
        // Check whether this code is linked to an Invite
        const invite = await prisma.invitation.findUnique({
            where: {
                type_code: {type: InvitationType.CODE, code: code}
            },
            rejectOnNotFound: true,
        })

        const anonEmail = hashUid(`${invite.cercleId}-${invite.code}-${new Date()}`)
        // Create and persist anonymous user
        const user = await prisma.user.create({
            data: {
                email: `${anonEmail}@${ANON_EMAIL_DOMAIN}`,
                reputationPoints: 1,
                reputationActions: {
                    create: {
                        actionType: ActionType.REGISTER_CODE
                    }
                },
                invitationsReceived: {
                    create: {
                        type: InvitationType.CODE,
                        creatorId: invite.creatorId,
                        cercleId: invite.cercleId,
                    }
                }
            }
        })
        console.log('create user :: joined with code', user)
        return user

    }
};
