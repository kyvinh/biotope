import {PossibleAnswer, QuestionType} from '@prisma/client'
import Likert from 'react-likert-scale';
import React, {useState} from "react";
import { useForm } from "react-hook-form";

export const Question = ({question, setState, answered, disabled = false, answerSubmit}) => {

    const sortedPossibleAnswers:PossibleAnswer[] = question.possibleAnswers
        .sort((a,b) => a.order - b.order);

    // -- QuestionType.LONG --

    const [longanswer, setLonganswer] = useState("test")

    const updateLongAnswer = (value) => {
        setLonganswer(value)
        setState(value)
    }

    // -- QuestionType.LIKERT --

    const [likertanswer, setLikertanswer] = useState(3)

    const likertOptions = {
        // https://github.com/Craig-Creeger/react-likert-scale#likert-props
        responses: sortedPossibleAnswers
            .map(possibleAnswer => ({value: possibleAnswer.id, text: possibleAnswer.possibleText}))
        ,
        id: question.id,
        onChange: val => {
            setLikertanswer(val.value)
            setState(val.value)    // Likert option values are possibleAnswer.id (text might be dangerous here!)
        }
    };

    // -- QuestionType.DYNAMIC --

    // -- RENDER --

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
                {question.type === QuestionType.DYNAMIC &&
                <>
                    { sortedPossibleAnswers.map(answer =>
                        <div className="form-check" key={`possible-answer-${answer.id}`}>
                            <input className="form-check-input" type="checkbox" value="" id={`possible-answer-${answer.id}`} />
                            <label className="form-check-label" htmlFor={`possible-answer-${answer.id}`}>
                                {answer.possibleText}
                            </label>
                        </div>)
                    }
                </>
                }
                <input type="submit" value="Submit" onClick={answerSubmit} disabled={disabled}/>
            </>
        }
    </>
};
