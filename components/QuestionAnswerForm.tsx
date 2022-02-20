import {PossibleAnswer, QuestionType} from '@prisma/client'
import Likert from 'react-likert-scale';
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {AnswerDto} from "../pages/api/q/[q]/answer";
import {fetcher} from "./util/fetcher";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {ANSWER_MAX_LENGTH} from "../lib/constants";

export const newAnswerTextProp = `newAnswerText`;
export const newAnswerCheckProp = `newAnswerCheck`;

export const QuestionAnswerForm = ({question, onAnswerSubmitted}) => {

    // Ref data
    const {data: session} = useSession({required: false})
    const sortedPossibleAnswers:PossibleAnswer[] = question.possibleAnswers

    // -- QuestionType.LONG --

    const [longanswer, setLonganswer] = useState("test")

    const updateLongAnswer = (value) => {
        setLonganswer(value)
        //setState(value)
    }

    // -- QuestionType.LIKERT --

    // noinspection JSUnusedLocalSymbols
    const [likertanswer, setLikertanswer] = useState(3)

    const likertOptions = {
        // https://github.com/Craig-Creeger/react-likert-scale#likert-props
        responses: sortedPossibleAnswers
            .map(possibleAnswer => ({value: possibleAnswer.id, text: possibleAnswer.possibleText}))
        ,
        id: question.id,
        onChange: val => {
            setLikertanswer(val.value)
            //setState(val.value)    // Likert option values are possibleAnswer.id (text might be dangerous here!)
        }
    };

    // -- QuestionType.DYNAMIC --

    const DynamicAnswer = ({answer}) => {
        return <div className="dynamic-answer form-check">
            <input className="form-check-input" type="checkbox"
                {...register(`${formPrefix}.${answer.id}`)} id={`${formPrefix}.${answer.id}`} />
            <label className="form-check-label" htmlFor={`${formPrefix}.${answer.id}`}>
                {answer.possibleText}
            </label>
        </div>
    }

    const NewDynamicAnswer = () => {

        const onNewAnswerChanged = async (event) => {
            event.preventDefault()
            const answerText = event.target.value;
            event.target.form[newAnswerCheckboxId].checked = answerText?.length > 0;
            setValue(newAnswerCheckboxId, true)
        }

        return <div className="dynamic-answer dynamic-new-answer form-check flex-row" key={`possible-answer-new`}>
            <input className="form-check-input" type="checkbox" {...register(newAnswerCheckboxId)} />
            <label className="form-check-label" htmlFor={newAnswerTextId}>Ajouter une réponse:</label>
            <input className={`form-control ms-2 ${errors[newAnswerTextId] ? 'is-invalid' : ''}`}
                   {...register(newAnswerTextId, {
                       onChange: onNewAnswerChanged, maxLength: ANSWER_MAX_LENGTH
                   })
                   } id={newAnswerTextId}/>
        </div>;
    }

    // -- COMPONENT --

    const { register, formState: { errors }, handleSubmit, setError, clearErrors, getValues, setValue} = useForm();
    const formPrefix = `question-${question.id}`;
    const newAnswerTextId = `${formPrefix}.${newAnswerTextProp}`;
    const newAnswerCheckboxId = `${formPrefix}.${newAnswerCheckProp}`;
    const [isSubmitted, setIsSubmitted] = useState(false)

    // noinspection SpellCheckingInspection
    const answerSubmit = async (values) => {
        /*
        console.log(values)
        For dynamic questions: {
            "question-ckxd4l25p0053i4uzwit3vy0p": {
                "ckxd4wtfc0063ekuzl19g8dax": false,
                "ckxd4wtfc0063ekuzl19g8qwe": true,
                newAnswerCheck: "true",
                newAnswerText: "new answer is here"
            }
        }
        */
        if (!session) {
            throw new Error("Currently no anonymous vote allowed!")
        } else {
            setIsSubmitted(true)
            let hasNewAnswer = false
            let newAnswerText = ''
            const possibleAnswerIds: string[] = Object.entries(values[`question-${question.id}`]).reduce((acc, [key, value]) => {
                if (key === newAnswerCheckProp) {
                    hasNewAnswer = value as boolean;
                } else if (key === newAnswerTextProp) {
                    newAnswerText = value as string;
                } else if (value) {
                    acc.push(key)
                }
                return acc
            }, [])

            const payload: AnswerDto = {
                possibleAnswerIds
            }
            if (hasNewAnswer) {
                payload.newAnswer = {
                    text: newAnswerText
                }
            }

            const res = await fetcher(`/api/q/${question.id}/answer`, payload);

            if (res?.status == 'ok') {
                await onAnswerSubmitted()
            }
        }
    }

    const handleAnswerSubmit = (e) => {
        // Check at least one answer!
        clearErrors()
        const values = getValues(formPrefix);
        const oneChecked = sortedPossibleAnswers.reduce((acc, answer) => acc || !!values[answer.id], false)
        if (!oneChecked && !values[newAnswerCheckProp]) {
            setError(formPrefix, {type: 'manual', message: 'Please choose at least one answer, or create your own.'})
        }
        handleSubmit(answerSubmit)(e)
    }

    // -- RENDER --

    const showForm = session && !isSubmitted;

    return <>
        <div className="subheader">
            <div className="subheader-title">
                <h3 className="fs-16">Your Answer
                    <small className="text-muted ms-2">(N'hésitez pas à "Ajouter une réponse" si les réponses prédéfinies ne vous conviennent pas!)</small></h3>
            </div>
        </div>
        { showForm &&
            <form className="answer-form" onSubmit={handleAnswerSubmit}>
                {question.type === QuestionType.LIKERT &&
                    <>
                        <Likert {...likertOptions} layout='stacked'/>
                    </>
                }
                {question.type === QuestionType.LONGTEXT &&
                    <>
                        <textarea value={longanswer} onChange={e => updateLongAnswer(e.target.value)}/>
                    </>
                }
                {question.type === QuestionType.DYNAMIC &&
                <>
                    { sortedPossibleAnswers.map(answer =>
                        <DynamicAnswer answer={answer} key={`possible-answer-${answer.id}`} />
                    )}
                    <NewDynamicAnswer />
                </>
                }
                <input type="hidden" name={formPrefix} className={`${errors[formPrefix] ? 'is-invalid' : ''}`} />
                <input type="submit" className="btn-answer btn btn-primary" value="Submit" disabled={isSubmitted} />
                { errors[formPrefix] && <div className="invalid-feedback">{errors[formPrefix].message}</div>}
            </form>
        }
        { !session &&
        <>
            <Link href="/api/auth/signin" locale={false}>
                <a className="btn btn-outline-primary">Sign in</a>
            </Link> to vote and see the results
        </>
        }
    </>
};