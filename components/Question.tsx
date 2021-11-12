import { QuestionType } from '@prisma/client'

export const Question = ({question}) => {
    return <>
        <div>{question.name}: {question.type} ({question.questionnaire.name})</div>
        <div>{question.description}</div>
        {
            question.type === QuestionType.LIKERT ?
                <>test</>
            : null
        }
    </>

};
