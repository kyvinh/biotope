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

        const resultsForQuestions = questionnaire.questions.reduce((results, question) => {
                const result = {
                    average: undefined,
                    type: question.type
                };
                switch (result.type) {
                    case QuestionType.LIKERT:
                        result.average = 3
                        break;
                    case QuestionType.TEXT:
                    case QuestionType.LONGTEXT:
                        // If these are text comments, ... what?
                        break;
                }
                return {...results, [question.id]: result}
            }, {})

        console.log("API Results", resultsForQuestions)
        return res.status(200).json({ results: resultsForQuestions})

    } catch (error) {
        console.error("QUESTIONNAIRE_RESULTS_ERROR", {
            identifier: questionnaireId,
            error
        });
        throw error;
    }
}