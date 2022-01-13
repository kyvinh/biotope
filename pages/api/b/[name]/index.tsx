import prisma from '../../../../components/util/prismaClient'
import {Prisma} from "@prisma/client";
import {parseISO} from "date-fns";

export const questionIncludeBiotopeQuery = {
    include: {
        creator: true,
        possibleAnswers: {
            include: {
                arguments: {
                    include: {
                        creator: true
                    }
                },
                creator: true
            },
            orderBy: {
                order: 'asc'    // TODO Does this work?
            }
        },
    }
}

export default async function handler(req, res) {

    // TODO: No authorization check here?!

    const b = await prisma.cercle.findUnique({
        where: {
            name: req.query.name
        },
        include: {
            creator: true,
            questions: {
                include: questionIncludeBiotopeQuery.include,
                orderBy: {
                    createdOn: 'asc',
                }
            }
        }
    })

    // Add some stats such as count of votes (distinct voters)

    const questionIds = b?.questions.reduce((acc, question) => { acc.push(question.id); return acc; }, []);
    const results = await prisma.$queryRaw`SELECT questionId, count(distinct hashUid) as votes, max(createdOn) as lastVoteDate FROM answer WHERE questionId in (${Prisma.join(questionIds)}) group by questionId`

    b.questions.forEach((question) => {
        const result = results.find((element) => element.questionId === question.id)
        question.votes = result ? result.votes : 0;
        question.lastVoteDate = result ? parseISO(result.lastVoteDate) : null;
    })

    // console.log(b.questions)
    return res.status(200).json(b)
}