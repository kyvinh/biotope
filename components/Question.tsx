import {QuestionType} from '@prisma/client'
import Likert from 'react-likert-scale';
import React, {useState} from "react";

export const Question = ({question, setState, answered, showTitle = true, disabled = false, answerSubmit}) => {

    const updateAnswer = (value) => {
        setLonganswer(value)
        setState(value)
    }

    const [longanswer, setLonganswer] = useState("test")
    const [likertanswer, setLikertanswer] = useState(3)

    const options = question.possibleAnswers.reduce(
        (acc, possibleAnswer) => [...acc, {value: possibleAnswer.id, text: possibleAnswer.possibleText}]
        , [])
    const likertOptions = {
        //question: `${question.name} (${question.type})`,
        responses: options,
        id: question.id,
        onChange: val => {
            setLikertanswer(val.value)
            setState(val.value)    // Likert option values are possibleAnswer.id (text might be dangerous here!)
        }
    };

    return <>
        { showTitle ? <div>{question.name}</div> : null}
        <div>{question.description}</div>
        {!answered ?
            <>
                {question.type === QuestionType.LIKERT ?
                    <>
                        <Likert {...likertOptions} layout='stacked'/>
                    </>
                : null}
                {question.type === QuestionType.LONGTEXT ?
                    <>
                        <textarea value={longanswer} onChange={e => updateAnswer(e.target.value)}/>
                    </>
                : null}
                <input type="submit" value="Submit" onClick={answerSubmit} disabled={disabled}/>
            </> : null}
    </>

};
