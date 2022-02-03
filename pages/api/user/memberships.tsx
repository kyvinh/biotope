import {createHandler, Get, Query} from "@storyofams/next-api-decorators";
import {HasUserIdAuthGuard} from "../../../lib/serverAnnotations";
import prisma from "../../../lib/prismaClient";

@HasUserIdAuthGuard()
class Memberships {

    @Get()
    // Find the concerned biotope for this invitee
    async fetchMemberships(@Query('first') isFirst: string, @Query('userId') userId: string) {
        const fetchFirstOnly = !!isFirst

        if (fetchFirstOnly) {
            // We should use this only for the first time the user has joined a biotope... there should only be one invitation here?
            const lastInvitation = await prisma.invitation.findFirst({
                where: {
                    invitedId: userId,
                    cercle: {private: true},
                },
                include: {cercle: true},
                orderBy: {createdOn: 'desc'}
            })

            return {redirect: `/b/${lastInvitation.cercle.name}`}

        } else {

            // Return: circles created + private circles invited + public circles

            return await prisma.cercle.findMany({
                where: {
                    OR: [
                        {creatorId: userId},
                        {
                            private: true,
                            invitations: {some: {invitedId: userId}}
                        },
                        {private: false}
                    ]
                },
            })
        }
    }
}

export default createHandler(Memberships);