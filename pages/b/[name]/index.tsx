import Link from 'next/link'
import {getSession, useSession} from "next-auth/react"
import React from "react";
import {QuestionHeader} from "../../../components/question/QuestionHeader";
import {fetchBiotope} from "../../api/b/[name]";
import {ReactMarkdown} from "react-markdown/lib/react-markdown";
import {EmailJoinForm} from "../../../components/EmailJoinForm";
import {formatDistance} from "../../../components/util/dates";
import messages from "../../../lib/messages.fr";

export async function getServerSideProps({params, req}) {
    const session = await getSession({req})
    const userId = session?.user?.id;
    const b = await fetchBiotope(userId, params.name);
    const redirectQuestion = b.questions?.find(element => element.starred && !element.userAnswered && !element.closed)
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

export default function BiotopeHome({b}) {

    // Required = false -> session might be null
    const {data: session} = useSession({required: false})
    const anonUser = !!session?.user.isAnon

    const ctaTest = `#### Merci pour votre participation ! Vos avis et commentaires sont précieux.

Bien que nous ne puissions pas organiser de festivités (Halloween, brocante, etc...) à cause des mesures sanitaires, nous restons actifs.

Voici quelques projets de l'APCJ en cours :
- Activités : contes et histoires lus par des parents
- Bâtiments : NeTournonsPasAutourDuPot.be
- Alimentation : présence à la commission des menus
- Sécurité : création de zones Kiss & Ride, rue scolaire et de lignes de Pédibus
`

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

            {
                !b.isAuthorized ?
                    <>
                        {session ?
                            <div>{messages.biotope["private-no-user-error"]}</div>
                            :
                            <div>
                                <Link href="/api/auth/signin" locale={false}>{messages.user["signin-action"]}</Link> pour accéder à ce biotope.
                            </div>}
                    </>
                    :
                    <section className="question-area">
                        <div className="container">
                            <div className="card card-item">
                                <div className="card-body">
                                    <ReactMarkdown className="markdown" children={ctaTest} />
                                </div>
                            </div>
                        </div>
                        {anonUser &&
                            <div className="container">
                                <EmailJoinForm />
                            </div>
                        }
                        <div className="container">
                            <div className="question-main-bar">
                                <div className="questions-snippet border-top border-top-gray">

                                    {b.questions && b.questions.map((question) => {

                                        const maxShortDescriptionLength = 200;
                                        question.shortDescription = question.description.length < maxShortDescriptionLength ? question.description : question.description.substring(0, maxShortDescriptionLength) + '…'

                                        return <div key={question.id}
                                                    className="media d-flex align-items-start media-card rounded-0 shadow-none my-3 bg-transparent p-2 border-bottom border-bottom-gray">
                                            <div className="votes text-center flex-fill">
                                                <div className="vote-block">
                                                    <span
                                                        className="vote-counts d-block text-center pr-0 lh-20 fw-medium">{question.votes}</span>
                                                    <span
                                                        className="vote-text d-block fs-13 lh-18">{question.votes > 1 ? messages.results.votes : messages.results.vote}</span>
                                                </div>
                                                {(question.closingDate || question.closed) &&
                                                <div
                                                    className={`answer-block ${question.closed ? 'closed' : 'answered'} my-2`}>
                                                    {question.closed
                                                    && <div>
                                                        <span className="answer-text d-block fs-13 lh-18">{messages.question.closed}</span>
                                                        <span
                                                            className="answer-counts d-block lh-20 fw-medium">{formatDistance(question.closingDate)}</span>
                                                    </div>
                                                    }
                                                    {!question.closed && question.closingDate
                                                    && <div>
                                                        <span
                                                            className="answer-text d-block fs-13 lh-18">{messages.question["closes-in"]} {formatDistance(question.closingDate)}</span>
                                                    </div>
                                                    }
                                                </div>
                                                }
                                            </div>
                                            <div className="media-body d-flex w-100 flex-column flex-fill">
                                                <h5 className="mb-2 fw-medium">
                                                    <Link href={`/b/${b.name}/q/${question.id}`}><a>{question.name}</a></Link>
                                                </h5>
                                                <div className="mb-2 lh-20 fs-15">{question.shortDescription}</div>
                                                <div className="media media-card user-media px-0 border-bottom-0 pb-0">
                                                    <div
                                                        className="media-body d-flex flex-wrap align-items-center justify-content-between">
                                                        <div className="d-block tags">
                                                            {question.tags.map((tag) =>
                                                                <span key={tag.id} className="tag-link">{tag.name}</span>)}
                                                        </div>
                                                        <div className="d-inline-flex">
                                                            {question.lastVoteDate
                                                            && <small className="meta d-block text-right">
                                                                <span
                                                                    className="text-black d-block lh-18">{messages.question["last-vote"]}</span>
                                                                <span
                                                                    className="d-block lh-18 fs-12">{formatDistance(question.lastVoteDate)}</span>
                                                            </small>
                                                            }
                                                            <small className="meta d-block text-right ps-3">
                                                                <span
                                                                    className="text-black d-block lh-18">{messages.question["asked-since"]}</span>
                                                                <span
                                                                    className="d-block lh-18 fs-12">{formatDistance(question.createdOn)}</span>
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>
            }

        </>
}