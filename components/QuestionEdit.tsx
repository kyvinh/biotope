import React from "react";
import {useForm} from "react-hook-form";
import {fetcher} from "./util/fetcher";
import {QuestionEditDto} from "../pages/api/q/[q]/edit";
import QuestionEditForm from "./QuestionEditForm";
import {NewAnswerForm} from "./question/edit/NewAnswerForm";
import {AnswerEditListItem} from "./question/edit/AnswerEditListItem";

export const QuestionEdit = ({question, onCancel, onQuestionEdit, onAnswerEdit}) => {

    const { register, handleSubmit, formState: { errors }, control } = useForm();

    const onQuestionSubmit = async (questionDto:QuestionEditDto) => {
        const res = await fetcher(`/api/q/${question.id}/edit`, questionDto);
        if (res?.status == 'ok') {
            question = res.updatedQuestion
            onQuestionEdit();
        }
    };

    return <>
        <form onSubmit={handleSubmit(onQuestionSubmit)} className="question-edit">
            <QuestionEditForm errors={errors} register={register} questionId={question.id} defaultValues={question} control={control} />
            <input className="btn btn-primary" type="submit" value="Update question"/>
            <button className="btn btn-link" onClick={onCancel}>Cancel</button>
        </form>

        <div className="answers-edit">
            <h6>Edit possible answers</h6>
            {question.possibleAnswers.map(answer => <AnswerEditListItem answer={answer} key={answer.id} onAnswerEdit={onAnswerEdit} />)}
        </div>

        <NewAnswerForm question={question} onAnswerEdit={onAnswerEdit} />
    </>
};
