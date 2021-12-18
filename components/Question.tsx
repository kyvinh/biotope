import {QuestionType} from '@prisma/client'
import Likert from 'react-likert-scale';
import React, {useState} from "react";
import { useForm } from "react-hook-form";

export const Question = ({question, setState, answered, disabled = false, answerSubmit}) => {

    const [longanswer, setLonganswer] = useState("test")
    const [likertanswer, setLikertanswer] = useState(3)

    const updateLongAnswer = (value) => {
        setLonganswer(value)
        setState(value)
    }

    const likertOptions = {
        // https://github.com/Craig-Creeger/react-likert-scale#likert-props
        responses: question.possibleAnswers
            .sort((a,b) => a.order - b.order)
            .map(possibleAnswer => ({value: possibleAnswer.id, text: possibleAnswer.possibleText}))
        ,
        id: question.id,
        onChange: val => {
            setLikertanswer(val.value)
            setState(val.value)    // Likert option values are possibleAnswer.id (text might be dangerous here!)
        }
    };

    return <>
        { !answered &&
            <>
                {question.type === QuestionType.LIKERT &&
                    <>
                        <Likert {...likertOptions} layout='stacked'/>
                    </>
                }
                {question.type === QuestionType.LONGTEXT &&
                    <>
                        <textarea value={longanswer} onChange={e => updateLongAnswer(e.target.value)}/>
                    </>
                }
                <input type="submit" value="Submit" onClick={answerSubmit} disabled={disabled}/>
            </>
        }
    </>
};
