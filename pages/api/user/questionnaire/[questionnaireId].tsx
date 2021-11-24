import {getSession} from "next-auth/react";
import {hashUid} from "../../../../components/util/user";
import prisma from '../../../../components/util/prismaClient'

export default async function handler(req, res) {

    const session = await getSession({req})
    const questionnaireId = req.query.questionnaireId;

    if (!session) {
        return res.status(401).json(new Error("Who are you?"))
    }
    if (!questionnaireId) {
        return res.status(500).json(new Error("Invalid request"))
    }

    // @ts-ignore
    const uid = hashUid(session.user.id);

    try {
        // select from answers left join question left join questionnaire where answers.hashId = uid group by questionnaire.id

        const result =
            await prisma.$queryRaw`select question.id as questionId, questionnaire.id as questionnaireId, 
                                    count(answer.id) as hasAnswer from answer
                                    left join question on answer.questionId = question.id
                                    left join questionnaire on questionnaire.id = question.questionnaireId
                                    where answer.hashUid = ${uid}
                                    and questionnaire.id = ${questionnaireId}
                                    group by question.id`
        return res.status(200).json(result);
    }
    catch (error) {
        console.log('Error while retrieving questionnaires answered:', error)
        return res.status(500).json({});
    }

}