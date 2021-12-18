import {QuestionType} from '@prisma/client'
import Likert from 'react-likert-scale';
import React, {useState} from "react";
import { useForm } from "react-hook-form";

export const Question = ({question, setState, answered, disabled = false, answerSubmit, editMode = false}) => {

    // -- Question types and all --

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

    // -- Question edit and all --

    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);

    return <>

        { editMode ? <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="name">Your question:</label>
                    <input id="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`} defaultValue={question.name}
                           {...register("name", { required: true })} />
                    <div className="invalid-feedback">Please specify your question here.</div>
                </div>
                <div className="form-group">
                    <label htmlFor="description">The context for your question, the more, the better:</label>
                    <textarea className="form-control" id="description"
    rows={3} {...register("description", {required: true})} defaultValue={question.description}/>
                    {errors.description && <div className="invalid-feedback">A description is required.</div>}
                </div>
                <input type="submit" />
            </form>
        </> : null}

        { !answered && !editMode ?
            <>
                {question.type === QuestionType.LIKERT ?
                    <>
                        <Likert {...likertOptions} layout='stacked'/>
                    </>
                : null}
                {question.type === QuestionType.LONGTEXT ?
                    <>
                        <textarea value={longanswer} onChange={e => updateLongAnswer(e.target.value)}/>
                    </>
                : null}
                <input type="submit" value="Submit" onClick={answerSubmit} disabled={disabled}/>
            </> : null}
    </>

};
