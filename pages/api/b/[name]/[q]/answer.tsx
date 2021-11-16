import {QuestionType, PrismaClient} from "@prisma/client";
const prisma = new PrismaClient()
import {getSession} from "next-auth/react";
import {hashUid} from "../../../../../components/util/user";

export default async function handler(req, res) {

    // Check request and params

    if (req.method !== 'POST') {
        res.status(400).send({message: 'Only POST requests allowed'})
        return
    }

    const biotopeName = req.query.name;
    const questionnaireId = req.query.q;
    const answers = req.body?.answers;

    if (!answers) {
        return res.status(400).send({message: 'Invalid POST request'})
    }

    const session = await getSession({ req })
    if (!session) {
        return res.status(401).json(new Error("Who are you?"))
        // TODO Should also check whether the user is a constituent, eligible for voting? Or whether he/she has already voted?
    }

    // @ts-ignore
    const uid = hashUid(session.user.id)

    try {

        // We need the questions' type to know how to store the answer value
        const questionnaire = await prisma.questionnaire.findUnique({
            where: {
                id: questionnaireId
            },
            include: {
                questions: true
            }
        })

        const upsertAnswers = []

        answers.map(({questionId, answer}) => {
            const question = questionnaire.questions.find(element => element.id == questionId)
            // Should modify createdOn?
            const updateClause = {
                answerNum: null,
                answerText: null
            };
            switch (question.type) {
                case QuestionType.LIKERT:
                    updateClause.answerNum = answer
                    break;
                case QuestionType.LONGTEXT:
                case QuestionType.TEXT:
                    updateClause.answerText = answer
                    break;
            }

            upsertAnswers.push(prisma.answer.upsert({
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
            }))
        })

        await prisma.$transaction(upsertAnswers)

    } catch (error) {
        console.error("QUESTIONNAIRE_ANSWER_ERROR", {
            cercle: biotopeName,
            identifier: questionnaireId,
            error
        });
        throw error;
    }

    return res.status(200).json({ status: 'ok'})

}