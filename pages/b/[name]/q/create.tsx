import React from "react";
import {useForm} from "react-hook-form";
import {fetcher} from "../../../../components/util/fetcher";
import {useRouter} from 'next/router'
import QuestionEditForm from "../../../../components/QuestionEditForm";
import {QuestionEditDto} from "../../../../lib/constants";
import messages from "../../../../lib/messages.fr";

// TODO: Test that user has enough rights to create a question?!

export default function BiotopeCreateQuestion() {

    const router = useRouter()
    const { name } = router.query

    // Question create form
    const { register, handleSubmit, formState: { errors }, control} = useForm();

    const onSubmit = async (questionDto:QuestionEditDto) => {
        const res = await fetcher(`/api/q/new?b=${name}`, questionDto);
        if (res?.status == 'ok') {
            // const question = res.question
            await router.push(`/b/${name}`)
        }
    };

    return <div className="container">
        <h3>{messages.question["create-question-header"]}:</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="question-edit">
            <QuestionEditForm register={register} errors={errors} control={control} />
            <input className="btn btn-primary" type="submit" value={messages.question["create-question-action"]} />
            <button className="btn btn-link" onClick={() => router.back()}>{messages.general.cancel}</button>
        </form>
    </div>
}