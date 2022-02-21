import {useRouter} from "next/router";
import {useBiotope} from "../../../../../components/util/hooks";
import Link from "next/link";
import React from "react";
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

const NextPager = ({b, question, nextQuestion}) => {
    return <div className="question-post-user-action d-flex flex-row-reverse mt-3">
        <div className="post-menu">
            {nextQuestion && question.userAnswered &&
                <Link href={`/b/${b.name}/q/${nextQuestion.id}/`}>
                    <a className="btn fs-16"><u>{messages.question["next-question-link"]} <i className="las la-arrow-circle-right"/></u></a>
                </Link>
            }
            {!nextQuestion && question.userAnswered &&
                <Link href={`/b/${b.name}/`}>
                    <a className="btn fs-16"><u>{messages.question["finished-questionnaire-link"]} <i className="las la-arrow-circle-right"/></u></a>
                </Link>
            }
        </div>
    </div>

}

export default function QuestionHome() {

    // Ref data
    const {data: session} = useSession({required: false})
    const {questionId, name} = useRouter().query
    const {biotope: b, reloadBiotope} = useBiotope(name as string)
    const question = b?.questions?.find((element) => element.id === questionId)

    const nextQuestion = b?.questions?.find(element => element?.id !== questionId && element.starred && !element.userAnswered && !element.closed)

    // Results of the votes (include comments?) on this questionnaire
    // Type of resultsObject = { questionId: { average: Int }
    const {
        data: answerResults,
        mutate: reloadAnswerResults
    } = useSWR(session && question?.id ? `/api/q/${question.id}/results` : null, fetcher);

    // Component state
    const showAnswerForm = question && !question.closed && !question.userAnswered;

    const onArgumentAdded = async () => {
        await reloadAnswerResults()
        await reloadBiotope()   // Should we really await?
    }

    const onAnswer = async () => {
        question.userAnswered = true;
        await reloadBiotope()
        await reloadAnswerResults()
    }

    return (b && question) ? <>

        <QuestionHeader biotope={b} />

        <section className="question-area pt-2 pb-5">
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
                                        <div className="question-meta">
                                            <div>
                                                <span className="pe-1">Asked</span>
                                                <span
                                                    className="text-black">{formatDistance(question.createdOn)}</span>
                                                <span className="ps-1 pe-1">by</span>
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
                                        <ReactMarkdown>{question.description || ''}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>

                            {question.creator.id === session?.user.id && !question.closed &&
                                <div className="question-post-user-action">
                                    <div className="post-menu">
                                        <Link href={`/b/${b.name}/q/${question.id}/edit`}><a className="btn">{messages.question["edit-question-link"]}</a></Link>
                                    </div>
                                </div>
                            }

                            <NextPager b={b} nextQuestion={nextQuestion} question={question} />

                        </div>

                        {showAnswerForm &&
                            <QuestionAnswerForm question={question}
                                                onAnswerSubmitted={onAnswer}/>
                        }

                        {((question.userAnswered || question.closed) && answerResults  && session) &&
                            <QuestionResults question={question} results={answerResults.results}
                                             onArgumentUpdated={onArgumentAdded} />
                        }

                        <NextPager b={b} nextQuestion={nextQuestion} question={question} />

                    </div>
                </div>
            </div>
        </section>

    </> : null
}