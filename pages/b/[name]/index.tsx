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
                    <div className="container">
                        <div className="card card-item">
                            <div className="card-body">
                                <ReactMarkdown className="markdown" children={ctaTest} />
                            </div>
                        </div>
                    </div>
                    <div className="hero-btn-box py-4">
                        <Link href={`/b/${b.name}/q/create`}>
                            <a className="btn theme-btn theme-btn-white">
                                Ask a Question <i className="la la-arrow-right icon ml-1" />
                            </a>
                        </Link>
                    </div>
                    {anonUser &&
                        <div className="container">
                            <EmailJoinForm />
                        </div>
                    }
                    <div className="container">
                        <div className="questions-snippet border-top border-top-gray">

                            {b.questions && b.questions.map((question) => {

                                const maxShortDescriptionLength = 200;
                                question.shortDescription = question.description.substring(0, maxShortDescriptionLength) + '…';

                                return <div key={question.id}
                                            className="media d-flex align-items-start media-card rounded-0 shadow-none my-3 bg-transparent p-2 border-bottom border-bottom-gray">
                                    <div className="votes text-center flex-fill">
                                        <div className="vote-block">
                                            <span
                                                className="vote-counts d-block text-center lh-20 fw-medium">{question.votes}</span>
                                            <span
                                                className="vote-text d-block fs-13 lh-18">{question.votes > 1 ? messages.results.votes : messages.results.vote}</span>
                                        </div>
                                        {question.userAnswered &&
                                            <div className="vote-block">
                                            <span className="vote-counts d-block text-center text-color-3 mt-3 fs-30 fw-medium">
                                                <i className="las la-vote-yea"/></span>
                                                <span className="vote-text d-block fs-13 lh-18 text-nowrap">A voté</span>
                                            </div>
                                        }
                                        {question.closed &&
                                        <div className={`answer-block ${question.closed ? 'closed' : 'answered'} my-2`}>
                                            <span className="answer-text d-block fs-13 lh-18">{messages.question.closed}</span>
                                            <span className="answer-counts d-block lh-20 fw-medium">{formatDistance(question.closingDate)}</span>
                                        </div>
                                        }
                                    </div>
                                    <div className="media-body d-flex w-100 flex-column flex-fill">
                                        <h5 className="mb-2 fw-medium">
                                            <Link href={`/b/${b.name}/q/${question.id}`}><a>{question.name}</a></Link>
                                        </h5>

                                        <Link href={`/b/${b.name}/q/${question.id}`}>
                                            <div className="mb-2 lh-20 fs-15 link-pointer">{question.shortDescription}</div>
                                        </Link>

                                        <div className="question-meta-list-item">
                                            <div className="tags">
                                                {question.tags.map((tag) =>
                                                    <span key={tag.id} className="tag-link">{tag.name}</span>)}
                                            </div>
                                            <div className="meta-dates">
                                                {!question.closed && question.lastVoteDate &&
                                                    <small>
                                                        <span className="meta-label">{messages.question["last-vote"]}</span>
                                                        <span className="meta-value">{formatDistance(question.lastVoteDate)}</span>
                                                    </small>
                                                }
                                                <small>
                                                    <span className="meta-label">{messages.question["asked-since"]}</span>
                                                    <span className="meta-value">{formatDistance(question.createdOn)}</span>
                                                </small>
                                                {!question.closed && question.closingDate && <small>
                                                    <span className="meta-label">{messages.question["closes-in"]}</span>
                                                    <span className={`meta-value ${!question.userAnswered ? 'meta-red' : ''}`}>{formatDistance(question.closingDate)}</span>
                                                </small>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </section>
            }

        </>
}