import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {ANSWER_MAX_LENGTH, PossibleAnswerInput} from "../../../lib/constants";
import {fetcher} from "../../util/fetcher";
import messages from "../../../lib/messages.fr";

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

    const onDeleteAnswer = async (event) => {
        event.preventDefault()
        const res = await fetcher(`/api/pa/${answer.id}/delete`, { deletedId: answer.id});
        if (res?.status == 'ok') {
            onAnswerEdit();
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
                            onClick={() => setAnswerFormShown(!answerFormShown)}>{messages["answer-edit"].edit}
                    </button>
                    {answer.count === 0 &&
                        <input className="btn btn-outline-danger" type="button" value={messages["answer-edit"].delete} onClick={onDeleteAnswer}/>
                    }
                </div>
            </div>
            : <div className="row">
                <form onSubmit={handleSubmit(onEditAnswer)} className="edit-answer col-10">
                    <div className="form-group">
                        <div className="form-text">{messages["answer-edit"]["edit-answer-info"]}</div>
                        <input className={`form-control ${errors.answerText ? 'is-invalid' : ''}`} defaultValue={answer.possibleText}
                               {...register("answerText", {required: true, maxLength: ANSWER_MAX_LENGTH})} />
                        <div className="invalid-feedback">{messages["answer-edit"]["edit-answer-required-error"]}</div>
                    </div>
                    <input className="btn btn-outline-primary" type="submit" value={messages["answer-edit"]["edit-answer-rename"]} />
                    <input className="btn btn-link" type="button" value={messages.general.cancel} onClick={() => setAnswerFormShown(!answerFormShown)} />
                </form>
            </div>
        }
    </div>
}
