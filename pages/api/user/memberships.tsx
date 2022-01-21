import {createHandler, Get, Query} from "@storyofams/next-api-decorators";
import {HasUserIdAuthGuard} from "../../../lib/serverAnnotations";
import prisma from "../../../components/util/prismaClient";

@HasUserIdAuthGuard()
class Memberships {

    @Get()
    async fetchMemberships(@Query('first') isFirst: string, @Query('userId') userId: string) {
        const fetchFirstOnly = !!isFirst

        if (fetchFirstOnly) {
            // We should use this only for the first time the user has joined a biotope... there should only be one invitation here?
            const lastInvitation = await prisma.invitation.findFirst({
                where: {
                    invitedId: userId,
                    cercle: {
                        private: true,
                    },
                },
                include: {
                    cercle: true
                },
                orderBy: {
                    createdOn: 'desc',
                }
            })

            return { redirect: `/b/${lastInvitation.cercle.name}`}

        } else {
            // Find many, ...
            throw new Error('Not implemented yet')
        }
    }
}

export default createHandler(Memberships);