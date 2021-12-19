import prisma from '../../../../components/util/prismaClient'
import {getSession} from "next-auth/react";
import {Question} from ".prisma/client";

export interface QuestionEditDto {
    name: string,
    description: string
}

export default async function handler(req, res) {

    // Check request and params

    if (req.method !== 'POST') {
        res.status(400).send({message: 'Only POST requests allowed'})
        return
    }

    const questionId = req.query.q;
    const questionData: QuestionEditDto = req.body;

    if (!questionData) {
        return res.status(400).send({message: 'Invalid POST request'})
    }

    const session = await getSession({req})
    if (!session) {
        return res.status(401).json(new Error("Who are you?"))
        // TODO Should also check whether the user is a constituent, eligible for voting? Or whether he/she has already voted?
    }


    try {

        // We need the questions' type to know how to store the answer value
        const originalQuestion:Question = await prisma.question.findUnique({
            where: {
                id: questionId
            }
        })

        if (!originalQuestion || originalQuestion.creatorId !== session.user.id) {
            throw new Error('Invalid /q request!')
        }

        const question:Question = await prisma.question.update({
            data: questionData,
            where: {
                id: questionId
            }
        })

    } catch (error) {
        console.error("QUESTION_EDIT_ERROR", {
            identifier: questionId,
            error
        });
        throw error;
    }

    return res.status(200).json({status: 'ok'})

}