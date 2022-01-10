import React from "react";
import {useForm} from "react-hook-form";
import {QuestionEditDto} from "../../api/q/[q]/edit";
import {fetcher} from "../../../components/util/fetcher";
import { useRouter } from 'next/router'

// TODO: Test that user has enough rights to create a question?!

export default function BiotopeCreateQuestion() {

    const router = useRouter()
    const { name } = router.query

    // Question create form
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (questionDto:QuestionEditDto) => {
        const res = await fetcher(`/api/q/new?b=${name}`, questionDto);
        if (res?.status == 'ok') {
            // const question = res.question
            await router.push(`/b/${name}`)
        }
    };

    return <div className="container">
        <h3>Create new question:</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="question-edit">
            <h6>Description</h6>
            <div className="form-group">
                <label htmlFor={`question-name`}>Your question:</label>
                <div className="form-text">Your question should be short and precise. More context should be added in the description below.</div>
                <input id={`question-name`} className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                       {...register("name", {required: true})} />
                <div className="invalid-feedback">Please specify your question here.</div>
            </div>
            <div className="form-group">
                <label htmlFor={`question-description`}>Complete description:</label>
                <div className="form-text">Your description should provide enough context to make an informed choice, or to suggest one.</div>
                <textarea className={`form-control ${errors.description ? 'is-invalid' : ''}`} id={`question-description`}
                          rows={3} {...register("description", {required: true})} />
                <div className="invalid-feedback">A description is required.</div>
            </div>
            <input className="btn btn-primary" type="submit" value="Create question"/>
        </form>
        <button className="btn btn-link" onClick={() => router.back()}>Cancel</button>
    </div>
}