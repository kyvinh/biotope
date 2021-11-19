import {QuestionType, PrismaClient} from "@prisma/client";
const prisma = new PrismaClient()
import {getSession} from "next-auth/react";

export default async function handler(req, res) {

    // Check request and params

    if (req.method !== 'GET') {
        res.status(400).send({message: 'Only GET requests allowed'})
        return
    }

    const questionnaireId = req.query.q;

    if (!questionnaireId) {
        return res.status(400).send({message: 'Invalid request'})
    }

    // TODO Should also check whether the user is a constituent, eligible for voting? Or whether he/she has already voted?
    // Should re-use what will be refactored in /b/[name]/index.tsx
    const session = await getSession({ req })
    if (!session) {
        return res.status(401).json(new Error("Who are you?"))
    }

    try {
        const questionnaire = await prisma.questionnaire.findUnique({
            where: {
                id: questionnaireId
            },
            include: {
                questions: {
                    include: {
                        answers: {
                            select: {
                                answerNum: true,
                                answerText: true
                            }
                        }
                    }
                }
            }
        })


        const answerResults = await prisma.answer.groupBy({
            by: ['questionId', "answerText", "answerNum"],
            where: {
                questionId: {
                    in: questionnaire.questions.reduce((ids, question) => [...ids, question.id], [])
                }
            },
            _count: true
        })
        // console.log("API Results", answerResults)

        /*
        API Results [
          {
            questionId: 'ckw25pixk0036c0uznmtotupl',
            answerText: 'Sale',
            answerNum: null,
            _count: 1
          },
          {
            questionId: 'ckw25piy00044c0uzlzqspuqp',
            answerText: "c'est sale",
            answerNum: null,
            _count: 1
          }
        ]
         */
        return res.status(200).json({ results: answerResults})

    } catch (error) {
        console.error("QUESTIONNAIRE_RESULTS_ERROR", {
            identifier: questionnaireId,
            error
        });
        throw error;
    }
}