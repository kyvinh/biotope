import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {fetcher} from "./util/fetcher";
import {QuestionEditDto} from "../pages/api/q/[q]/edit";

export const QuestionEdit = ({question, cancel}) => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (questionDto:QuestionEditDto) => {
        const res = await fetcher(`/api/q/${question.id}/edit`, questionDto);
        if (res?.status == 'ok') {
            // TODO: question should be re-sent to parent to be included in original data source
            question = res.updatedQuestion
        }
    };

    const [newAnswer, setNewAnswer] = useState('')
    const submitAddNewAnswer = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (newAnswer.length > 0 && newAnswer.length < 150) {
            const res = await fetcher(`/api/q/${question.id}/newAnswer`, { newAnswer });
            if (res?.status == 'ok') {
                // TODO: question should be re-sent to parent to be included in original data source
                question = res.updatedQuestion
            }
        }

    }

    return <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label htmlFor={`question-${question.id}.name`}>Your question:</label>
                <input id={`question-${question.id}.name`} className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                       defaultValue={question.name}
                       {...register("name", {required: true})} />
                <div className="invalid-feedback">Please specify your question here.</div>
            </div>
            <div className="form-group">
                <label htmlFor={`question-${question.id}.description`}>The context for your question, the more, the better:</label>
                <textarea className="form-control" id={`question-${question.id}.description`}
                          rows={3} {...register("description", {required: true})} defaultValue={question.description}/>
                {errors.description && <div className="invalid-feedback">A description is required.</div>}
            </div>
            <input type="submit"/>
            <button className="btn btn-link" onClick={cancel}>Cancel</button>
        </form>

        <h6>Edit possible answers</h6>
        <div className="container answers-edit">
            {question.possibleAnswers.map(answer =>
                <div className="row" key={answer.id}>
                    <div className="col-3">
                        {answer.possibleText}
                    </div>
                    <div className="col-3">
                        _EDIT_ _DELETE_
                    </div>
                </div>
            )}
            <div className="row">
                <div className="col-6">
                    Add new answer:
                    <input value={newAnswer} onChange={(e) => { setNewAnswer(e.target.value) } } />
                    <button className="btn btn-link" onClick={submitAddNewAnswer}>Add</button>
                </div>
            </div>
        </div>

        <style jsx>{`
          div.answers-edit .row:hover {
            background-color: lightgrey;
          }
        `}</style>

    </>
};
