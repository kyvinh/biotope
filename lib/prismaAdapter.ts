// Override PrismaAdapter to handle reputation points/log
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import prisma from "./prismaClient";
import {ActionType, InvitationType} from "@prisma/client";

export const prismaAdapter = PrismaAdapter(prisma);
prismaAdapter.createUser = async (data) => {
    data.reputationActions = {
        create: [{actionType: ActionType.REGISTER_EMAIL}]
    }
    data.reputationPoints = 5
    // console.log('create user :: handle invitations', data)
    return prisma.user.create({data})   // Returns a promise
}

// Cleanup biotope invitations and link the invite to the userId rather than his email
export const linkEmailInvitations = async (user) => {
    try {
        await prisma.$transaction([
            // Link to userId rather than email
            prisma.invitation.updateMany({
                where: {
                    type: InvitationType.EMAIL,
                    invitedEmail: user.email,
                },
                data: {
                    // Privacy by design: Remove the email
                    invitedEmail: null,
                    invitedId: user.id
                }
            }),
            // TODO: Might as well cleanup verification tokens (from all users)?
            // TODO: Deleting for all users may be wrong. What if user exists and invited to another biotope? The invitation should stay until the user logs in to activate this invite?
            // // Delete expired unopened invitations
            // prisma.invitation.deleteMany({
            //     where: {
            //         type: InvitationType.EMAIL,
            //         invitedEmail: user.email,
            //         createdOn: {
            //             lte: addDays(new Date(), -90)    // Should not be hardcoded 90 -> use expiration date
            //         }
            //     }
            // }),
        ]);
    } catch (error) {
        console.log('linkEmailInvitations::error', error)
        console.log('linkEmailInvitations::error::user', user)
        // Do not block on errors...
    }
}
