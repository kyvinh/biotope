import {PrismaClient} from '@prisma/client'
import {getSession} from "next-auth/react";

const prisma = new PrismaClient()

// TODO AUTH!
export default async function handler(req, res) {

    let b;

    if (req.query.user === "") {

        const session = await getSession({ req })

        if (!session) {
            res.status(401)
            return
        }

        // @ts-ignore
        let userId = session.user.id;

        b = await prisma.cercle.findUnique({
            where: {
                name: req.query.name
            },
            include: {
                invitations: {
                    where: {
                        invitedId: userId
                    }
                },
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