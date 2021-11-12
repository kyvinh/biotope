import { Question } from '../../components/Question'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getServerSideProps = async (req) => {
    const b = await prisma.cercle.findUnique({
        where: {
            name: req.query.name
        },
        include: {
            creator: true,
            questionnaires: {
                include: {
                    creator: true,
                    questions: {
                        include: {
                            creator: true
                        },
                        orderBy: {
                            createdOn: 'asc'
                        }
                    }
                }
            }
        }
    })
    return { props: { biotope: b } }
}

export default function BiotopeHome({ biotope: b }) {
    return b ? (
        <div className="container">
                    <div><h4>{b.name}</h4><span>{b.creator.name}</span> on {b.createdOn.toUTCString()}</div>
                    <div>{b.invitations ? b.invitations.length : "0"} invitation(s)</div>
                    { b.contact ?
                        <div>Contact possible: {b.contact}</div>
                        : <div/>}
                    <div>
                    { b.questionnaires ? b.questionnaires.map((questionnaire) => {
                        return <div key={questionnaire.id}>
                            <h5>{questionnaire.name}</h5>
                            { questionnaire.questions?.map((question) => {
                                question.questionnaire = questionnaire  // Fill the relation for rendering in Question comp
                                return <Question key={question.id} question={question} />
                            })}
                        </div>
                    }) : null}
                    </div>
        </div>
    ) : null
}