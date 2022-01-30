import {getSession} from "next-auth/react";
import {hashUid} from "../../../../lib/user";
import prisma from '../../../../lib/prismaClient'

export default async function handler(req, res) {

    const session = await getSession({req})
    const questionId = req.query.questionId;

    if (!session) {
        return res.status(401).json(new Error("Who are you?"))
    }
    if (!questionId) {
        return res.status(500).json(new Error("Invalid request"))
    }

    const hashedUid = hashUid(session.user.id);

    try {
        // Check whether the user has answered this question already
        // We voluntarily don't fetch the data (privacy) but just the count

        const result =
            await prisma.answer.count({
                where: {
                    questionId: questionId,
                    hashUid: hashedUid
                }
            })

        const answerResult = {answered: false};

        if (result > 0) {
            answerResult.answered = true;
        }
        res.status(200).json(answerResult)
    }
    catch (error) {
        console.log('Error while retrieving answered question:', error)
        return res.status(500).json({});
    }

}