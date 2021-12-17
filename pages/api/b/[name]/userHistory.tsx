import {getSession} from "next-auth/react";
import prisma from '../../../../components/util/prismaClient'

export default async function handler(req, res) {

    const session = await getSession({ req })
    // @ts-ignore
    const userId = session?.user?.id;

    if (!userId) {
        // Not logged in so no UserHistory
        return res.status(401).json(new Error("Who are you?"))
    }

    const b = await prisma.cercle.findUnique({
        where: {
            name: req.query.name
        },
        include: {
            invitations: {
                where: {
                    invitedId: userId
                }
            },
        }
    });

    // console.log(b)

    // If private biotope, check that we have access
    if (b.private) {
        if (userId !== b.creatorId && b.invitations.length == 0) {
            // user has not been invited here
            return res.status(401).json(new Error("This is private"))
        }
    }

    return res.status(200).json(b)
}