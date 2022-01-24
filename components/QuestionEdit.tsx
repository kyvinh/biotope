import React from "react";
import {useForm} from "react-hook-form";
import {fetcher} from "./util/fetcher";
import {QuestionEditDto} from "../pages/api/q/[q]/edit";
import QuestionEditForm from "./QuestionEditForm";
import {NewAnswerForm} from "./question/edit/NewAnswerForm";
import {AnswerEditListItem} from "./question/edit/AnswerEditListItem";
import useSWR from "swr";
import {useSession} from "next-auth/react";
import {computeResults} from "./QuestionResults";

export const QuestionEdit = ({question, onCancel, onQuestionEdit, onAnswerEdit}) => {

    const {data: session} = useSession()    // Just to make sure we are authenticated!

    const { register, handleSubmit, formState: { errors }, control } = useForm();
    const {data: answerResults} = useSWR(`/api/q/${question.id}/results`, fetcher);
    const rawResults = answerResults.results    // TODO Is answerResults ever null?
    const {resultsWithCount: answersWithCount} = computeResults(question, rawResults)

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
            <input className="btn btn-link" type="button" value="Cancel" onClick={onCancel}/>
        </form>

        <div className="answers-edit">
            <h6>Edit possible answers</h6>
            {answersWithCount.map(answer =>
                <AnswerEditListItem answer={answer} key={answer.id} onAnswerEdit={onAnswerEdit} />
            )}
        </div>

        <NewAnswerForm question={question} onAnswerEdit={onAnswerEdit} />
    </>
};
