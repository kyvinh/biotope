import React from "react";
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

    return <>
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
                <button className="btn btn-link" onClick={cancel}>Cancel</button>
            </form>
        </>
};
