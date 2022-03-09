import {Catch, createHandler, Get, Query} from "@storyofams/next-api-decorators";
import {HasUserIdAuthGuard, internalServerErrorLogger} from "../../../lib/serverAnnotations";
import prisma from "../../../lib/prismaClient";

export function fetchLastMembership(userId: string) {
    return prisma.invitation.findFirst({
        where: {
            invitedId: userId,
            cercle: {private: true},
        },
        include: {cercle: true},
        orderBy: {createdOn: 'desc'}
    });
}

export function fetchMemberships(userId: string) {
    // Return: circles created + private circles invited + public circles

    return prisma.cercle.findMany({
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

@Catch(internalServerErrorLogger)
@HasUserIdAuthGuard()
class Memberships {

    @Get()
    // Find the concerned biotope for this invitee
    async fetchMemberships(@Query('first') isFirst: string, @Query('userId') userId: string) {
        const fetchFirstOnly = !!isFirst

        if (fetchFirstOnly) {
            // We should use this only for the first time the user has joined a biotope... there should only be one invitation here?
            const lastInvitation = await fetchLastMembership(userId);
            return {redirect: `/b/${lastInvitation.cercle.name}`}

        } else {
            return await fetchMemberships(userId);
        }
    }
}

export default createHandler(Memberships);