import Link from 'next/link'
import {getSession, useSession} from "next-auth/react"
import React from "react";
import {QuestionHeader} from "../../../components/question/QuestionHeader";
import {fetchBiotope} from "../../api/b/[name]";
import {ReactMarkdown} from "react-markdown/lib/react-markdown";
import {EmailJoinForm} from "../../../components/EmailJoinForm";
import messages from "../../../lib/messages.fr";
import {QuestionListItem} from "../../../components/question/QuestionListItem";

export async function getServerSideProps({params, req}) {
    const session = await getSession({req})
    const userId = session?.user?.id;
    const b = await fetchBiotope(userId, params.name);
    const redirectQuestion = b.questions?.find(element => element.introFlag && !element.userAnswered && !element.closed)
    if (redirectQuestion) {
        return {
            redirect: {
                destination: `/b/${params.name}/q/${redirectQuestion.id}`,
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

export const whatsappText = `L'Association des Parents de Claire Joie a créé un sondage. Participez aussi: https://biotope.brussels/code/apcj22`

export default function BiotopeHome({b}) {

    const {data: session} = useSession({required: false})
    const anonUser = !!session?.user.isAnon
    const unansweredCount = b?.questions.filter(question => !question.userAnswered && !question.closed).length

    return !b ? <></> :
        <>
            <QuestionHeader biotope={b} />

            {/* CALL TO ACTION? Prenez quelques minutes pour participer à notre grande enquête 2022 !
                        <div className="col-lg-3">
                            <div className="hero-btn-box py-4">
                                <a href="ask-question.html" className="btn theme-btn theme-btn-white">Ask a
                                    Question <i className="la la-arrow-right icon ml-1"/></a>
                            </div>
                            <div className="hero-list hero-list-bg">
                                <div className="d-flex align-items-center pb-30px">
                                    <img src="/images/anonymousHeroQuestions.svg" alt="question icon" className="mr-3" />
                                        <p className="fs-15 text-white lh-20">Anybody can ask a question</p>
                                </div>
                                <div className="d-flex align-items-center pb-30px">
                                    <img src="/images/anonymousHeroAnswers.svg" alt="question answer icon"
                                         className="mr-3" />
                                        <p className="fs-15 text-white lh-20">Anybody can answer</p>
                                </div>
                                <div className="d-flex align-items-center">
                                    <img src="/images/anonymousHeroUpvote.svg" alt="vote icon" className="mr-3" />
                                        <p className="fs-15 text-white lh-20">The best answers are voted up and rise to
                                            the top</p>
                                </div>
                            </div>
                        </div>

                        // More info: ...
                        <div className="col-lg-5">
                            <div className="hero-content py-5">
                                <h2 className="section-title fs-30">{b.name}</h2>
                                {b.description && <p className="section-desc pb-3">{b.description}</p>}
                                {b.contact && <p className="text-muted">Contact: {b.contact}</p>}
                                <p className="text-muted">Biotope created by <UserFlair
                                    user={b.creator}/> on {formatDate(b.createdOn)}.&nbsp;</p>
                                <p className="section-desc text-black">472,665 Questions</p>
                                <div>
                                    <Link href={`/b/${b.name}/invite`}>inviter un voisin</Link> -
                                    <Link href={`/b/${b.name}/q/create`}>lancer un sondage</Link>
                                </div>
                            </div>
                        </div>

                        */}

            {!b.isAuthorized && session &&
                <div>{messages.biotope["private-error"]}</div>
            }
            {!b.isAuthorized && !session &&
                <div>
                    <Link href="/api/auth/signin" locale={false}>{messages.user["signin-action"]}</Link> pour accéder à ce biotope.
                </div>
            }

            {b.isAuthorized &&
                <section className="question-area">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12 col-md-8">
                                <div className="card card-item">
                                    <div className="card-body pt-3 pb-0">
                                        <ReactMarkdown className="markdown" children={b.introConclusion} linkTarget="_blank" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="card card-item text-center">
                                    <div className="container card-body py-2 px-4 justify-content-between">
                                        <div className="row">
                                            <div className="col-4 col-md-12">
                                                <i className="las la-users fs-70 text-color-5" />
                                            </div>
                                            <div className="col-8 col-md-12">
                                                <h5 className="card-title pt-2 pb-1 fs-18">{messages.invitation["invite-cta-label"]}</h5>
                                                <div className="d-flex flex-wrap justify-content-center">
                                                    <Link href={`/b/${b.name}/invite`}>
                                                        <a className="btn theme-btn theme-btn-white m-1">{messages.invitation["invite-email-cta"]} <i className="la la-envelope-open-text icon fs-20"/></a>
                                                    </Link>
                                                    <Link href={`https://wa.me/?text=${encodeURI(whatsappText)}`}>
                                                        <a className="btn theme-btn theme-btn-white m-1">{messages.invitation["invite-whatsapp-cta"]} <i className="la la-whatsapp icon fs-20"/></a>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {!anonUser &&
                                    <div className="card card-item text-center">
                                        <div className="container card-body py-2 px-4 justify-content-between">
                                            <div className="row">
                                                <div className="col-4 col-md-12">
                                                    <img src="/images/bubble.png" height="70" alt="discuss"/>
                                                </div>
                                                <div className="col-8 col-md-12">
                                                    <h5 className="card-title pt-2 pb-1 fs-18">{messages.question["create-question-cta-label"]}</h5>
                                                    <Link href={`/b/${b.name}/q/create`}>
                                                        <a className="btn theme-btn theme-btn-white">{messages.question["create-question-cta"]} <i className="la la-arrow-right icon"/></a>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <EmailJoinForm />
                    </div>
                    <div className="container">
                        <div className="questions-header border-top border-top-gray px-2 py-3 my-2 d-flex d-flex-column justify-content-between">
                            <h3 className="fs-22 fw-medium">{messages.question['list-header']}:</h3>
                            <div className="pt-1 fs-15 fw-medium lh-20">{b.questions.length} {b.questions.length > 1 ? messages.question["question-plural"]: messages.question.question}
                                , {unansweredCount} {unansweredCount > 1 ? messages.question["question-unanswered-plural"]: messages.question['question-unanswered']}</div>
                        </div>
                        <div className="questions-snippet border-top border-top-gray">
                            {b.questions && b.questions.map((question) => <QuestionListItem key={question.id} question={question} b={b} />)}
                        </div>
                    </div>
                </section>
            }
        </>
}