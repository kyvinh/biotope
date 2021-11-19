import prisma from '../../../../components/util/prismaClient'
import {getSession} from "next-auth/react";

export default async function handler(req, res) {

    // Check request and params

    if (req.method !== 'POST') {
        res.status(400).send({message: 'Only POST requests allowed'})
        return
    }

    const questionId = req.query.q;
    const argumentText = req.body?.argumentText;

    if (!questionId && !argumentText) {
        return res.status(400).send({message: 'Invalid request'})
    }

    // TODO Should also check whether the user is a constituent, eligible for voting? Or whether he/she has already voted?
    // Should re-use what will be refactored in /b/[name]/index.tsx
    const session = await getSession({ req })
    if (!session) {
        return res.status(401).json(new Error("Who are you?"))
    }

    try {

        const argument = await prisma.argument.create({
            data: {
                questionId: questionId,
                text: argumentText,
                // TODO We should provide the answerNum or Text so we can visually organise this argument
                // But this means we have to retrieve the user's answers, which is not ideal... or we can re-ask the author?
            }
        })
        return res.status(200).json({ argument: argument})

    } catch (error) {
        console.error("QUESTION_C_ARG_ERROR", {
            identifier: questionId,
            error
        });
        throw error;
    }
}