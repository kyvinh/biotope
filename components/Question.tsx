import {PossibleAnswer, QuestionType} from '@prisma/client'
import Likert from 'react-likert-scale';
import React, {useState} from "react";
import { useForm } from "react-hook-form";

export const Question = ({question, answered, disabled = false, answerSubmit}) => {

    const sortedPossibleAnswers:PossibleAnswer[] = question.possibleAnswers
        .sort((a,b) => a.order - b.order);

    // -- QuestionType.LONG --

    const [longanswer, setLonganswer] = useState("test")

    const updateLongAnswer = (value) => {
        setLonganswer(value)
        //setState(value)
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
            //setState(val.value)    // Likert option values are possibleAnswer.id (text might be dangerous here!)
        }
    };

    // -- QuestionType.DYNAMIC --

    const DynamicAnswer = ({answer}) => {
        return <div className="form-check">
            <input className="form-check-input" type="checkbox"
                {...register(`question-${question.id}.${answer.id}`)} id={`question-${question.id}.${answer.id}`} />
            <label className="form-check-label" htmlFor={`question-${question.id}.${answer.id}`}>
                {answer.possibleText}
            </label>
        </div>
    }

    const NewDynamicAnswer = () => {
        return <div className="form-check" key={`possible-answer-new`}>
            <input className="form-check-input" type="checkbox" value="false" disabled={true} />
            <label className="form-check-label" htmlFor={`possible-answer-new`}>
                <input />
            </label>
        </div>
    }

    // -- COMPONENT --

    const { register, formState: { errors }, handleSubmit, setError, clearErrors, getValues} = useForm();

    const handleAnswerSubmit = (e) => {
        // Check we chose at least one answer!
        clearErrors()
        const oneChecked = sortedPossibleAnswers.reduce((acc, answer) => !!getValues(`question-${question.id}`)[answer.id], false)
        if (!oneChecked) {
            setError(`question-${question.id}`, {type: 'manual', message: 'Please choose at least one answer, or create your own.'})
        }
        handleSubmit(answerSubmit)(e)
    }

    // -- RENDER --

    return <>
        { !answered &&
            <form onSubmit={handleAnswerSubmit}>
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
                        <DynamicAnswer answer={answer} key={`possible-answer-${answer.id}`} />
                    )}
                    <NewDynamicAnswer />
                </>
                }
                <input type="hidden" name={`question-${question.id}`} className={`${errors[`question-${question.id}`] ? 'is-invalid' : ''}`} />
                <input type="submit" value="Submit" disabled={disabled}/>
                { errors[`question-${question.id}`] && <div className="invalid-feedback">{errors[`question-${question.id}`].message}</div>}
            </form>
        }
    </>
};