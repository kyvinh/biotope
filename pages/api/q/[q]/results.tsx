import prisma from '../../../../components/util/prismaClient'
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
            include: {
                questions: {
                    include: {
                        possibleAnswers: {
                            include: {
                                _count: {
                                    select: { answers: true }
                                }
                            }
                        }
                    }
                }
            },
            where: {
                id: questionnaireId
            },
        })

        const answerResults = questionnaire.questions

        /*
            API Results [
            {
                id: 'ckweupytg0076p0uz3j7ygwm2',
                type: 'LIKERT',
                name: 'Comment jugez-vous la propreté de la rue Félix Terlinden?',
                description: "Notre rue mérite une attention particulière car elle est à proximité de plusieurs centres d'activité: La Chasse, Jourdan, Flagey.",
                questionnaireId: 'ckweupysx0068p0uzfqcph5ks',
                createdOn: 2021-11-25T11:07:23.140Z,
                creatorId: 'ckweup6ov0000swuzkxd5wyqt',
                possibleAnswers: [ [Object], [Object], [Object], [Object], [Object] ]
              },
              {
                id: 'ckweupyu90091p0uzsjjobdl3',
                type: 'LIKERT',
                name: 'Comment jugez-vous le comportement des passants par rapport à la propreté dans la rue Félix Terlinden?',
                description: 'Les piétons, résidents, et passants ont tous une responsabilité par rapport à la salubrité publique. Est-ce que leurs comportements sont suffisamment civils selon vous?
            ',
                questionnaireId: 'ckweupysx0068p0uzfqcph5ks',
                createdOn: 2021-11-25T11:07:23.169Z,
                creatorId: 'ckweup6ov0000swuzkxd5wyqt',
                possibleAnswers: [ [Object], [Object], [Object], [Object], [Object] ]
              },
              {
                id: 'ckweupyut0106p0uzz9op2jau',
                type: 'LIKERT',
                name: 'Quelles activités seraient bénéfiques pour la propreté dans la rue Félix Terlinden?',
                description: "Quelles activités à soutenir? Rajouter une proposition d'activité si possible.",
                questionnaireId: 'ckweupysx0068p0uzfqcph5ks',
                createdOn: 2021-11-25T11:07:23.189Z,
                creatorId: 'ckweup6ov0000swuzkxd5wyqt',
                possibleAnswers: [ [Object], [Object], [Object] ]
              }
            ]
         */

        // console.log("API Results", answerResults)

        return res.status(200).json({ results: answerResults})

    } catch (error) {
        console.error("QUESTIONNAIRE_RESULTS_ERROR", {
            identifier: questionnaireId,
            error
        });
        throw error;
    }
}