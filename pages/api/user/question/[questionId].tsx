import {getSession} from "next-auth/react";
import {hashUid} from "../../../../components/util/user";
import prisma from '../../../../components/util/prismaClient'

export default async function handler(req, res) {

    const session = await getSession({req})
    const questionId = req.query.questionId;

    if (!session) {
        return res.status(401).json(new Error("Who are you?"))
    }
    if (!questionId) {
        return res.status(500).json(new Error("Invalid request"))
    }

    // @ts-ignore
    const hashedUid = hashUid(session.user.id);

    try {
        // Check whether the user has answered this question already

        const result =
            await prisma.answer.count({
                where: {
                    questionId: questionId,
                    hashUid: hashedUid
                }
            })

/*
            await prisma.$queryRaw`select question.id as questionId,
                                    count(answer.id) as hasAnswer from answer
                                    left join question on answer.questionId = question.id
                                    left join cercle on cercle.id = question.cercleId
                                    where answer.hashUid = ${hashedUid}
                                    and cercle.id = ${questionId}
                                    group by question.id`
*/
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