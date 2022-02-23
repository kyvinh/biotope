import React from "react";
import {useForm} from "react-hook-form";
import {fetcher} from "../../../../../components/util/fetcher";
import QuestionEditForm from "../../../../../components/QuestionEditForm";
import {NewAnswerForm} from "../../../../../components/question/edit/NewAnswerForm";
import {AnswerEditListItem} from "../../../../../components/question/edit/AnswerEditListItem";
import useSWR from "swr";
import {useSession} from "next-auth/react";
import {computeResults} from "../../../../../components/QuestionResults";
import {QuestionHeader} from "../../../../../components/question/QuestionHeader";
import {useRouter} from "next/router";
import {useBiotope} from "../../../../../components/util/hooks";
import Link from "next/link";
import {QuestionEditDto} from "../../../../../lib/constants";
import messages from "../../../../../lib/messages.fr";

// TODO Prereq: we should not be here if no session and biotope is private

export default function QuestionEditHome() {

    // Ref data
    const {data: session} = useSession({required: false})
    const router = useRouter()
    const {questionId, name} = router.query
    const {biotope: b, reloadBiotope} = useBiotope(name as string)
    const question = b?.questions?.find((element) => element.id === questionId)

    // Results of the votes (include comments?) on this questionnaire
    // Type of resultsObject = { questionId: { average: Int }
    const {
        data: answerResults,
        mutate: reloadAnswerResults
    } = useSWR(session && question?.id ? `/api/q/${question.id}/results` : null, fetcher);
    const rawResults = answerResults?.results
    let answersWithCount
    if (rawResults) {
        ({resultsWithCount: answersWithCount} = computeResults(question.possibleAnswers, rawResults));
    }

    const {register, handleSubmit, formState: {errors}, control} = useForm();

    const onQuestionSubmit = async (questionDto: QuestionEditDto) => {
        const res = await fetcher(`/api/q/${question.id}/edit`, questionDto);
        if (res?.status == 'ok') {
            await router.push(`/b/${name}/q/${question.id}`)
        }
    };

    const onAnswerEdit = async () => {
        await reloadBiotope();
        await reloadAnswerResults();
    }

    return b && question && answersWithCount ?
        <>
            <QuestionHeader biotope={b} showDescription={false}/>

            <section className="shadow-sm mb-2">
                <div className="container">
                    <div className="py-2 px-3">
                        <h2 className="section-title">{messages.question["create-question-header"]}</h2>
                    </div>
                </div>
            </section>

            <section className="question-area">
                <div className="container">
                    <div className="card card-item p-3">
                        <form onSubmit={handleSubmit(onQuestionSubmit)} className="question-edit card-body p-0">
                            <QuestionEditForm errors={errors} register={register} questionId={question.id}
                                              defaultValues={question}
                                              control={control}/>
                            <input className="btn btn-primary" type="submit" value={messages.question["update-question-action"]}/>
                            <Link href={`/b/${b.name}/q/${question.id}`}><a className="btn btn-link">{messages.general.cancel}</a></Link>
                        </form>
                    </div>
                </div>

                <div className="container">
                    <div className="card card-item p-3">
                        <div className="answers-edit">
                            <h6>{messages.question["edit-answers-lead"]}</h6>
                            {answersWithCount.map(answer =>
                                <AnswerEditListItem answer={answer} key={answer.id} onAnswerEdit={onAnswerEdit}/>
                            )}
                        </div>
                        <NewAnswerForm question={question} onAnswerEdit={onAnswerEdit}/>
                    </div>
                </div>
            </section>
        </>
        : null;
};
