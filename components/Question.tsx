import { QuestionType } from '@prisma/client'
import Likert from 'react-likert-scale';
import {useState} from "react";

export const Question = ({question}) => {

    const [longanswer, setLonganswer] = useState("test")
    const [likertanswer, setLikertanswer] = useState(3)

    const likertOptions = {
        question: `${question.name} (${question.type})`,
        responses: [
            { value: 1, text: "Insalubre" },
            { value: 2, text: "Sale" },
            { value: 3, text: "Normale", /* checked: likertanswer == 3 */},
            { value: 4, text: "Propre" },
            { value: 5, text: "Sans reproche" }
        ],
        id: question.id,
        onChange: val => {
            console.log(val);
            setLikertanswer(val.value)
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
        {
            question.type === QuestionType.LONGTEXT ?
                <>
                    <textarea value={longanswer} onChange={e => setLonganswer(e.target.value)} />
                </>
                : null
        }
    </>

};
