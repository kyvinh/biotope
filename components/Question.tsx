import {QuestionType} from '@prisma/client'
import Likert from 'react-likert-scale';
import {useState} from "react";

export const Question = ({question, setState, answered}) => {

    const updateAnswer = (value) => {
        setLonganswer(value)
        setState(question.id, value)
    }

    const [longanswer, setLonganswer] = useState("test")
    const [likertanswer, setLikertanswer] = useState(3)

    const likertOptions = {
        //question: `${question.name} (${question.type})`,
        responses: [
            {value: 1, text: "Insalubre"},
            {value: 2, text: "Sale"},
            {value: 3, text: "Normale", /* checked: likertanswer == 3 */},
            {value: 4, text: "Propre"},
            {value: 5, text: "Sans reproche"}
        ],
        id: question.id,
        onChange: val => {
            setLikertanswer(val.value)
            setState(question.id, val.value)
        }
    };

    return <>
        <div>{question.name}</div>
        <div>{question.description}</div>
        {!answered ?
            (question.type === QuestionType.LIKERT ?
                <>
                    <Likert {...likertOptions} layout='stacked'/>
                </>
                :
            question.type === QuestionType.LONGTEXT ?
                <>
                    <textarea value={longanswer} onChange={e => updateAnswer(e.target.value)}/>
                </>
                : null
            )
            : <p>Question answered</p>
        }
    </>

};
