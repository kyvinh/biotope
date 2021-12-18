import prisma from '../../../../components/util/prismaClient'
import {getSession} from "next-auth/react";

export default async function handler(req, res) {

    // Check request and params

    if (req.method !== 'GET') {
        res.status(400).send({message: 'Only GET requests allowed'})
        return
    }

    const questionId = req.query.q;

    if (!questionId) {
        return res.status(400).send({message: 'Invalid request'})
    }

    // TODO Should also check whether the user is authorized:
    //      - user is a constituent, eligible for voting?
    //      - Or whether he/she has already voted?
    const session = await getSession({ req })
    if (!session) {
        return res.status(401).json(new Error("Who are you?"))
    }

    try {
        const question = await prisma.question.findUnique({
            include: {
                possibleAnswers: {
                    include: {
                        _count: {
                            select: { answers: true }
                        }
                    }
                }
            },
            where: {
                id: questionId
            },
        })

        // console.log("API Results", question.possibleAnswers)

        return res.status(200).json({ results: question.possibleAnswers})

    } catch (error) {
        console.error("QUESTION_RESULTS_ERROR", {
            identifier: questionId,
            error
        });
        throw error;
    }
}