import React from "react";
import {useForm} from "react-hook-form";
import {fetcher} from "../../../../components/util/fetcher";
import {useRouter} from 'next/router'
import QuestionEditForm from "../../../../components/QuestionEditForm";
import {QuestionEditDto} from "../../../../lib/constants";
import messages from "../../../../lib/messages.fr";
import {getSession} from "next-auth/react";
import {fetchBiotope} from "../../../api/b/[name]";
import {QuestionHeader} from "../../../../components/question/QuestionHeader";

export async function getServerSideProps({params, req}) {
    const session = await getSession({req})
    const userId = session?.user?.id;
    const b = await fetchBiotope(userId, params.name);

    if (!b.isAuthorized) {
        return {
            redirect: {
                destination: `/b/${params.name}/`,
                permanent: false,
            },
        };
    } else {
        return {
            props: {
                b
            }
        }
    }
}

export default function BiotopeCreateQuestion({b}) {

    const router = useRouter()
    const name = b.name

    // Question create form
    const { register, handleSubmit, formState: { errors }, control} = useForm();

    const onSubmit = async (questionDto:QuestionEditDto) => {
        const res = await fetcher(`/api/q/new?b=${name}`, questionDto);
        if (res?.status == 'ok') {
            // const question = res.question
            await router.push(`/b/${name}`)
        }
    };

    return <>
        <QuestionHeader biotope={b} showDescription={false} />

        If no email then question to review
        Check if private, etc...

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
                    <form onSubmit={handleSubmit(onSubmit)} className="question-edit card-body p-0">
                        <QuestionEditForm register={register} errors={errors} control={control} />
                        <div className="mt-2">
                            <input className="btn btn-primary" type="submit" value={messages.question["create-question-action"]} />
                            <button className="btn btn-link" onClick={() => router.back()}>{messages.general.cancel}</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </>
}