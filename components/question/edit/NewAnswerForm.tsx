import {useForm} from "react-hook-form";
import {fetcher} from "../../util/fetcher";
import React from "react";
import {ANSWER_MAX_LENGTH, NewAnswerInput} from "../../../lib/constants";

export const NewAnswerForm = ({question, onAnswerEdit}) => {

    // New answer form
    const {register, handleSubmit, formState: {errors}, reset} = useForm();

    const onAddNewAnswer = async (newAnswerDto: NewAnswerInput) => {
        const res = await fetcher(`/api/q/${question.id}/newAnswer`, newAnswerDto);
        if (res?.status == 'ok') {
            onAnswerEdit();
            reset();
        }
    }

    return <form onSubmit={handleSubmit(onAddNewAnswer)} className="add-new-answer">
        <h6>Add new answer</h6>
        <div className="form-group">
            <div className="form-text">Your new answer will be suggested to new voters. Previous voters will be informed
                through their biotope feed.
            </div>
            <input className={`form-control ${errors.newAnswer ? 'is-invalid' : ''}`}
                   {...register("newAnswer", {required: true, maxLength: ANSWER_MAX_LENGTH})} />
            <div className="invalid-feedback">Please specify a new answer to be suggested to the voters.</div>
        </div>
        <input className="btn btn-outline-primary" type="submit" value="Add new answer"/>
    </form>
}
