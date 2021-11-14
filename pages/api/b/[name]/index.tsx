import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {

    const b = await prisma.cercle.findUnique({
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
    res.status(200).json(b)
}