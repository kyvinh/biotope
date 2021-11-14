import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

// TODO AUTH!
export default async function handler(req, res) {

    let b;

    if (req.query.user) {

        // b = await prisma.

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