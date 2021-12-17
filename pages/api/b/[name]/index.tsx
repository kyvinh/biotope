import prisma from '../../../../components/util/prismaClient'

export default async function handler(req, res) {

    // TODO: No authorization check here?!

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
                            creator: true,
                            possibleAnswers: {
                                orderBy: {
                                    order: 'asc'    // TODO Does this work?
                                }
                            },
                            arguments: true,
                        },
                        orderBy: {
                            createdOn: 'asc',
                        }
                    }
                }
            }
        }
    })

    return res.status(200).json(b)
}