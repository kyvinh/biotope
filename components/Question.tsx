import { QuestionType } from '@prisma/client'
import Likert from 'react-likert-scale';

export const Question = ({question}) => {

    const likertOptions = {
        question: `${question.name} (${question.type})`,
        responses: [
            { value: 1, text: "Insalubre" },
            { value: 2, text: "Sale" },
            { value: 3, text: "Normale", checked: true },
            { value: 4, text: "Propre" },
            { value: 5, text: "Sans reproche" }
        ],
        id: question.id,
        onChange: val => {
            console.log(val);
        }
    };

    return <>
        <div>{question.name}: {question.type} ({question.questionnaire.name})</div>
        <div>{question.description}</div>
        {
            question.type === QuestionType.LIKERT ?
                <>
                    <Likert {...likertOptions} layout='stacked'/>
                </>
            : null
        }
    </>

};
