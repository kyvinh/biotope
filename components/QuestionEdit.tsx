import React from "react";
import {useForm} from "react-hook-form";
import {fetcher} from "./util/fetcher";
import {QuestionEditDto} from "../pages/api/q/[q]/edit";
import {NewAnswerInput} from "../pages/api/q/[q]/newAnswer";
import QuestionEditForm from "./QuestionEditForm";

export const QuestionEdit = ({question, onCancel, onQuestionEdit, onAnswerEdit}) => {

    // Question edit form
    const { register, handleSubmit, formState: { errors }, control } = useForm();

    const onQuestionSubmit = async (questionDto:QuestionEditDto) => {
        const res = await fetcher(`/api/q/${question.id}/edit`, questionDto);
        if (res?.status == 'ok') {
            question = res.updatedQuestion
            onQuestionEdit();
        }
    };

    // New answer form
    const { register: registerAnswer, handleSubmit: handleAnswerSubmit, formState: { errors: answerErrors }, reset: resetAnswer } = useForm();

    const onAddNewAnswer = async (newAnswerDto:NewAnswerInput) => {
        if (newAnswerDto.newAnswer.length > 0 && newAnswerDto.newAnswer.length < 150) {
            const res = await fetcher(`/api/q/${question.id}/newAnswer`, newAnswerDto);
            if (res?.status == 'ok') {
                question = res.updatedQuestion
                // onQuestionEdit();
                onAnswerEdit();
                resetAnswer();
            }
        }
    }

    return <>
        <form onSubmit={handleSubmit(onQuestionSubmit)} className="question-edit">
            <QuestionEditForm errors={errors} register={register} questionId={question.id} defaultValues={question} control={control} />
            <input className="btn btn-primary" type="submit" value="Update question"/>
            <button className="btn btn-link" onClick={onCancel}>Cancel</button>
        </form>

        <div className="answers-edit">
            <h6>Edit possible answers</h6>
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
        </div>

        <form onSubmit={handleAnswerSubmit(onAddNewAnswer)} className="add-new-answer">
            <h6>Add new answer</h6>
            <div className="form-group">
                <div className="form-text">Your new answer will be suggested to new voters. Previous voters will be informed through their biotope feed.</div>
                <input className={`form-control ${answerErrors.newAnswer ? 'is-invalid' : ''}`}
                       {...registerAnswer("newAnswer", {required: true})} />
                <div className="invalid-feedback">Please specify a new answer to be suggested to the voters.</div>
            </div>
            <input className="btn btn-outline-primary" type="submit" value="Add new answer"/>
        </form>
    </>
};
