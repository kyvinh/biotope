import {PossibleAnswer, QuestionType} from '@prisma/client'
import Likert from 'react-likert-scale';
import React, {useState} from "react";
import {useForm} from "react-hook-form";

export const newAnswerTextProp = `newAnswerText`;
export const newAnswerCheckProp = `newAnswerCheck`;

export const Question = ({question, answered, disabled = false, answerSubmit}) => {

    const sortedPossibleAnswers:PossibleAnswer[] = question.possibleAnswers

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
                {...register(`${formPrefix}.${answer.id}`)} id={`${formPrefix}.${answer.id}`} />
            <label className="form-check-label" htmlFor={`${formPrefix}.${answer.id}`}>
                {answer.possibleText}
            </label>
        </div>
    }

    const NewDynamicAnswer = () => {

        const onNewAnswerChanged = async (event) => {
            event.preventDefault()
            const answerText = event.target.value;
            event.target.form[newAnswerCheckboxId].checked = answerText?.length > 0;
        }

        return  <div className="form-check" key={`possible-answer-new`}>
                    <div className="form-text">Add a new answer if none are relevant.</div>
                    <input className="form-check-input" type="checkbox"
                        {...register(newAnswerCheckboxId)} />
                    <label className="form-check-label" htmlFor={newAnswerTextId}>Other:
                        <input {...register(newAnswerTextId, { onChange: onNewAnswerChanged })} id={newAnswerTextId}  />
                    </label>
                </div>;
    }

    // -- COMPONENT --

    const { register, formState: { errors }, handleSubmit, setError, clearErrors, getValues} = useForm();
    const formPrefix = `question-${question.id}`;
    const newAnswerTextId = `${formPrefix}.${newAnswerTextProp}`;
    const newAnswerCheckboxId = `${formPrefix}.${newAnswerCheckProp}`;

    const handleAnswerSubmit = (e) => {
        // Check at least one answer!
        clearErrors()
        const values = getValues(formPrefix);
        const oneChecked = sortedPossibleAnswers.reduce((acc, answer) => acc || !!values[answer.id], false)
        if (!oneChecked && !values[newAnswerCheckProp]) {
            setError(formPrefix, {type: 'manual', message: 'Please choose at least one answer, or create your own.'})
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
                <input type="hidden" name={formPrefix} className={`${errors[formPrefix] ? 'is-invalid' : ''}`} />
                <input type="submit" className="btn btn-primary" value="Submit" disabled={disabled}/>
                { errors[formPrefix] && <div className="invalid-feedback">{errors[formPrefix].message}</div>}
            </form>
        }
    </>
};