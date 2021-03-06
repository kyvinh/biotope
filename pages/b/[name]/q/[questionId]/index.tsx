import {useRouter} from "next/router";
import {useBiotope} from "../../../../../components/util/hooks";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {ReactMarkdown} from "react-markdown/lib/react-markdown";
import {UserFlair} from "../../../../../components/UserFlair";
import {useSession} from "next-auth/react";
import useSWR from "swr";
import {fetcher} from "../../../../../components/util/fetcher";
import {QuestionAnswerForm} from "../../../../../components/QuestionAnswerForm";
import {QuestionResults} from "../../../../../components/QuestionResults";
import {QuestionHeader} from "../../../../../components/question/QuestionHeader";
import {formatDistance} from "../../../../../components/util/dates";
import messages from "../../../../../lib/messages.fr";

// TODO Prereq: we should not be here if no session and biotope is private

const NextPager = ({b, question, nextQuestion, unansweredNum = 0}) => {
    return <>
            {unansweredNum > 0 &&
                <div className="mx-3 fs-14">{unansweredNum} {messages.question["remaining-questions"]}</div>
            }
            {nextQuestion && question.userAnswered &&
                <Link href={`/b/${b.name}/q/${nextQuestion.id}/`}>
                    <a className="btn btn-primary"><u>{messages.question["next-question-link"]} <i className="las la-arrow-circle-right"/></u></a>
                </Link>
            }
            {!nextQuestion && question.userAnswered &&
                <Link href={`/b/${b.name}/`}>
                    <a className="btn btn-primary"><u>{messages.question["finished-questionnaire-link"]} <i className="las la-arrow-circle-right"/></u></a>
                </Link>
            }
        </>
}

export default function QuestionHome() {

    // Ref data
    const {data: session} = useSession({required: false})
    const router = useRouter();
    const {questionId, name} = router.query
    const {biotope: b, reloadBiotope} = useBiotope(name as string)
    const question = b?.questions?.find((element) => element.id === questionId)

    const nextQuestion = b?.questions?.find(element => element?.id !== questionId && element.introFlag && !element.userAnswered && !element.closed)
    const numIntroUnanswered = b?.questions?.reduce((previous, current) => (current.introFlag && !current.userAnswered && !current.closed) ? (previous + 1) : previous, 0)
    const additionalHeaderText = question?.introFlag ? b.introText : null;

    const currentQuestionIndex = b?.questions?.findIndex((element) => element.id === questionId);
    let pagerNextQuestion = null
    let pagerPreviousQuestion = null
    if (currentQuestionIndex !== undefined && currentQuestionIndex >=0) {
        const questionsLength = b.questions.length
        if (currentQuestionIndex < questionsLength - 1) {
            pagerNextQuestion = b.questions[currentQuestionIndex+1]
        }
        if (currentQuestionIndex > 0) {
            pagerPreviousQuestion = b.questions[currentQuestionIndex-1]
        }
    }

    // Results of the votes (include comments?) on this questionnaire
    // Type of resultsObject = { questionId: { average: Int }
    const {
        data: answerResults,
        mutate: reloadAnswerResults
    } = useSWR(session && question?.id ? `/api/q/${question.id}/results?combinations=true` : null, fetcher);

    // Component state
    const [showAnswerForm, setShowAnswerForm] = useState(false)

    const isQuestionCreator = question && session && question.creatorId === session.user.id;
    const showEditQuestionLink = isQuestionCreator && !question.closed;
    const showChangeAnswerLink = question && question.userAnswered && !showAnswerForm;

    useEffect(() => {
        setShowAnswerForm(question && !question.closed && !question.userAnswered)
    }, [question])

    const onArgumentAdded = async () => {
        await reloadAnswerResults()
        await reloadBiotope()   // Should we really await?
    }

    const onAnswer = async () => {
        question.userAnswered = true;
        await reloadBiotope()
        await reloadAnswerResults()
    }

    const onShowAnswerFormClick = () => {
        setShowAnswerForm(!showAnswerForm);
    }

    const onCancelAnswerFormClick = () => {
        if (question.userAnswered) {
            setShowAnswerForm(false)
        } else {
            void router.push(`/b/${b.name}`)
        }
    }

    return (b && question) ? <>

        <QuestionHeader biotope={b} additionalText={additionalHeaderText}/>

        {!question.closed && isQuestionCreator &&
            <div className="alert alert-success mb-0" role="alert">
                {messages.question["create-success-1"]} <Link href={`/b/${b.name}/invite`}>{messages.question["create-success-invite"]}</Link>
                {messages.question["create-success-2"]}
            </div>
        }

        <section className="question-area">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-10 offset-lg-1">
                        <div className="question-main-bar mb-3">
                            <div className="question-highlight">
                                <div className="media media-card shadow-none rounded-0 mb-0 bg-transparent p-0">
                                    <div className="media-body">
                                        <div className="tags">
                                            {question.tags.map((tag) => <span className="tag-link"
                                                                              key={tag.id}>{tag.name}</span>)}
                                        </div>
                                        <div className="question-meta-full-width">
                                            <div>
                                                <span className="pe-1">{messages.question["asked-since"]}</span>
                                                <span
                                                    className="text-black">{formatDistance(question.createdOn)}</span>
                                                <span className="ps-1 pe-1">{messages.question["asked-by"]}</span>
                                                <span className="text-black"><UserFlair user={question.creator}
                                                                                        theme="none"/></span>
                                            </div>
                                            {question.closed && question.closingDate &&
                                                <div>
                                                    <span className="pe-1">{messages.question.closed}</span>
                                                    <span
                                                        className="text-black">{formatDistance(question.closingDate)}</span>
                                                </div>
                                            }
                                            {(!question.closed && question.closingDate) &&
                                                <div>
                                                    <span className="pe-1">{messages.question["closes-in"]}</span>
                                                    <span
                                                        className="text-black">{formatDistance(question.closingDate)}</span>
                                                </div>
                                            }
                                            {question.lastVoteDate &&
                                                <div>
                                                    <span className="pe-1">{messages.question["last-vote"]}</span>
                                                    <span
                                                        className="text-black">{formatDistance(question.lastVoteDate)}</span>
                                                </div>
                                            }
                                        </div>
                                        <h5 className="fs-20 py-2">{question.name}</h5>
                                    </div>
                                </div>
                            </div>

                            <div className="question d-flex">
                                <div className="question-post-body-wrap flex-grow-1">
                                    <div className="question-post-body markdown">
                                        <ReactMarkdown linkTarget="_blank">{question.description || ''}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>

                            {(showEditQuestionLink || showChangeAnswerLink || nextQuestion) &&
                                <div className="question-post-user-action">
                                    <div className="post-menu d-flex justify-content-between">
                                        <div>
                                            {showEditQuestionLink &&
                                                <Link href={`/b/${b.name}/q/${question.id}/edit`}><a
                                                    className="btn">{messages.question["edit-question-link"]}</a></Link>
                                            }
                                            {showChangeAnswerLink &&
                                                <a className="btn"
                                                   onClick={onShowAnswerFormClick}>{messages.question["change-answers-link"]}</a>
                                            }
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <NextPager b={b} nextQuestion={nextQuestion} question={question}
                                                       unansweredNum={numIntroUnanswered}/>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                        {showAnswerForm &&
                            <>
                                {question.userAnswered &&
                                    <div className="alert alert-info fs-15 py-1 px-2" role="alert">
                                        {messages.question["change-answers-info"]}
                                    </div>
                                }
                                <QuestionAnswerForm question={question}
                                                    onAnswerSubmitted={onAnswer} cancelForm={onCancelAnswerFormClick}/>
                            </>
                        }

                        {((question.userAnswered || question.closed) && answerResults && !showAnswerForm && session) &&
                            <>
                                <QuestionResults question={question} results={answerResults.results}
                                                 onArgumentUpdated={onArgumentAdded} /*showDebug={isQuestionCreator}*/ />
                                <div className="d-flex justify-content-between mt-3">
                                    {pagerPreviousQuestion ?
                                        <Link href={`/b/${b.name}/q/${pagerPreviousQuestion.id}/`}>
                                            <a className="btn btn-outline-primary"><i
                                                className="las la-arrow-circle-left"/> {messages.question["previous-question-link"]}
                                            </a>
                                        </Link> :
                                        <Link href={`/b/${b.name}/`}>
                                            <a className="btn btn-outline-primary"><i className="las la-list"/> {messages.question["back-to-list"]}</a>
                                        </Link>

                                    }
                                    {pagerNextQuestion ?
                                        <Link href={`/b/${b.name}/q/${pagerNextQuestion.id}/`}>
                                            <a className="btn btn-outline-primary">{messages.question["next-question-link"]} <i className="las la-arrow-circle-right"/></a>
                                        </Link> :
                                        <Link href={`/b/${b.name}/`}>
                                            <a className="btn btn-outline-primary"><i className="las la-list"/> {messages.question["back-to-list"]}</a>
                                        </Link>
                                    }
                                </div>
                            </>
                        }

                        {question.userAnswered &&   // Only show Next Question and Finished Intro Questionnaire
                            <div className="question-post-user-action d-flex flex-row-reverse mt-3">
                                <div className="post-menu d-flex justify-content-between">
                                    <NextPager b={b} nextQuestion={nextQuestion} question={question} />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </section>

    </> : null
}