import {QuestionType} from '@prisma/client'
import Likert from 'react-likert-scale';
import React, {useState} from "react";
import { useForm } from "react-hook-form";

export const QuestionEdit = ({question}) => {


    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);

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
            </form>
        </>
};
