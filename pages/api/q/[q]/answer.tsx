import prisma from '../../../../components/util/prismaClient'
import {getSession} from "next-auth/react";
import {hashUid} from "../../../../components/util/user";

export interface AnswerDto {
    possibleAnswerId?: string,
    newAnswer?: {
        text?: string
    }
}

export default async function handler(req, res) {

    // Check request and params

    if (req.method !== 'POST') {
        res.status(400).send({message: 'Only POST requests allowed'})
        return
    }

    const questionId = req.query.q;
    const answer:AnswerDto = req.body;

    if (!answer) {
        return res.status(400).send({message: 'Invalid POST request'})
    }

    const session = await getSession({ req })
    if (!session) {
        return res.status(401).json(new Error("Who are you?"))
        // TODO Should also check whether the user is a constituent, eligible for voting? Or whether he/she has already voted?
    }

    const uid = hashUid(session.user.id)

    try {

        // We need the questions' type to know how to store the answer value
        const question = await prisma.question.findUnique({
            where: {
                id: questionId
            },
            include: {
                possibleAnswers: true
            }
        })

        if (!question) {
            throw new Error('Invalid /q request!')
        }

        const transaction = []

        const updateClause = {
            // answer is the possibleAnswer.id
            // TODO Should modify createdOn?
            possibleAnswerId: answer.possibleAnswerId
        };

        transaction.push(
            prisma.answer.upsert({
                where: {
                    questionId_hashUid: {
                        questionId: questionId,
                        hashUid: uid
                    }
                },
                update: updateClause,
                create: {
                    ...updateClause,
                    hashUid: uid,
                    questionId: questionId,
                }
            })
        )

        await prisma.$transaction(transaction)

    } catch (error) {
        console.error("QUESTION_ANSWER_ERROR", {
            identifier: questionId,
            error
        });
        throw error;
    }

    return res.status(200).json({ status: 'ok'})

}