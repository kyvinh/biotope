import prisma from '../../../../components/util/prismaClient'
import {getSession} from "next-auth/react";

export class NewArgumentInput {
    argumentText: string;
}

export default async function handler(req, res) {

    // Check request and params

    if (req.method !== 'POST') {
        res.status(400).send({message: 'Only POST requests allowed'})
        return
    }

    const possibleAnswerId = req.query.q;
    const argumentText = req.body?.argumentText;

    if (!possibleAnswerId && !argumentText) {
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
                possibleAnswerId: possibleAnswerId,
                text: argumentText,
                creatorId: session.user.id,
            }
        })
        return res.status(200).json({status: 'ok', argument})

    } catch (error) {
        console.error("QUESTION_ANSWER_ARG_ERROR", {
            identifier: possibleAnswerId,
            error
        });
        throw error;
    }
}