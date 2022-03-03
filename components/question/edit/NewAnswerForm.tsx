import {useForm} from "react-hook-form";
import {fetcher} from "../../util/fetcher";
import React from "react";
import {ANSWER_MAX_LENGTH, NewAnswerInput} from "../../../lib/constants";
import messages from "../../../lib/messages.fr";

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
        <h6>{messages["answer-edit"]["add-answer-lead"]}</h6>
        <div className="form-group">
            <div className="form-text">{messages["answer-edit"]["add-answer-info"]}</div>
            <input className={`form-control ${errors.newAnswer ? 'is-invalid' : ''}`}
                   {...register("newAnswer", {required: true, maxLength: ANSWER_MAX_LENGTH})} />
            <div className="invalid-feedback">{messages["answer-edit"]["edit-answer-required-error"]}</div>
        </div>
        <input className="btn btn-outline-primary" type="submit" value={messages["answer-edit"]['add-answer-action']}/>
    </form>
}
