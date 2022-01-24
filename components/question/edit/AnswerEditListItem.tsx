import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {ANSWER_MAX_LENGTH, PossibleAnswerInput} from "../../../pages/api/constants";
import {fetcher} from "../../util/fetcher";

export const AnswerEditListItem = ({answer, onAnswerEdit}) => {
    const [answerFormShown, setAnswerFormShown] = useState(false)
    const {register, handleSubmit, formState: {errors}} = useForm();

    const onEditAnswer = async (answerDto: PossibleAnswerInput) => {
        const res = await fetcher(`/api/pa/${answer.id}/edit`, answerDto);
        if (res?.status == 'ok') {
            onAnswerEdit();
            setAnswerFormShown(false)
        }
    }

    return <div>
        {!answerFormShown ?
            <div className="row">
                <div className="col-9">
                    {answer.possibleText}
                </div>
                <div className="col-3">
                    <button className="btn btn-outline-dark"
                            onClick={() => setAnswerFormShown(!answerFormShown)}>Edit
                    </button>
                </div>
            </div>
            : <div className="row">
                <form onSubmit={handleSubmit(onEditAnswer)} className="edit-answer col-10">
                    <div className="form-group">
                        <div className="form-text">Editing your answer will need to be approved eventually!</div>
                        <input className={`form-control ${errors.answerText ? 'is-invalid' : ''}`} defaultValue={answer.possibleText}
                               {...register("answerText", {required: true, maxLength: ANSWER_MAX_LENGTH})} />
                        <div className="invalid-feedback">Please specify a text for this answer.</div>
                    </div>
                    <input className="btn btn-outline-primary" type="submit" value="Rename answer"/>
                    <button className="btn btn-link" onClick={() => setAnswerFormShown(!answerFormShown)}>Cancel</button>
                </form>
            </div>
        }
    </div>
}
