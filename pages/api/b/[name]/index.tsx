import {PrismaClient} from '@prisma/client'
import {getSession} from "next-auth/react";

const prisma = new PrismaClient()

// TODO AUTH!
export default async function handler(req, res) {

    let b;

    if (req.query.user === "") {

        const session = await getSession({ req })
        let invitationInclude
        let userId

        if (!session) {
            // If no user, fetch the basic information, then check whether user has access
            invitationInclude = false
        } else {
            // @ts-ignore
            let userId = session.user.id;
            invitationInclude = {
                where: {
                    invitedId: userId
                }
            }
        }

        b = await prisma.cercle.findUnique({
            where: {
                name: req.query.name
            },
            include: {
                invitations: invitationInclude,
                creator: true,
                questionnaires: {
                    include: {
                        creator: true,
                        questions: {
                            include: {
                                creator: true
                            },
                            orderBy: {
                                createdOn: 'asc'
                            }
                        }
                    }
                }
            }
        });

        // console.log(b)

        // If private biotope, check that we have access
        if (b.private) {
            if (!userId) {
                // Private biotope and not logged in
                res.status(401).json(new Error("Who are you?"))
                return

            } else {
                if (userId !== b.creatorId && b.invitations.length == 0) {
                    // user has not been invited here
                    res.status(401).json(new Error("This is private"))
                    return
                }
            }
        }

    } else {

        b = await prisma.cercle.findUnique({
            where: {
                name: req.query.name
            },
            include: {
                creator: true,
                questionnaires: {
                    include: {
                        creator: true,
                        questions: {
                            include: {
                                creator: true
                            },
                            orderBy: {
                                createdOn: 'asc'
                            }
                        }
                    }
                }
            }
        })

    }

    res.status(200).json(b)
}