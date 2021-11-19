import {getSession} from "next-auth/react";
import prisma from '../../../../components/util/prismaClient'

export default async function handler(req, res) {

    let b;

    if (req.query.user === "") {

        const session = await getSession({ req })
        let invitationInclude
        let userId

        if (!session) {
            // If no user, fetch the basic information to show the public profile or private property, then check whether user has access
            invitationInclude = false
        } else {
            // @ts-ignore
            userId = session.user.id;
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
                return res.status(401).json(new Error("Who are you?"))
            } else {
                if (userId !== b.creatorId && b.invitations.length == 0) {
                    // user has not been invited here
                    return res.status(401).json(new Error("This is private"))
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
                                creator: true,
                                possibleAnswers: {
                                    orderBy: {
                                        order: 'asc'    // TODO Does this work?
                                    }
                                }
                            },
                            orderBy: {
                                createdOn: 'asc',
                            }
                        }
                    }
                }
            }
        })

    }

    return res.status(200).json(b)
}