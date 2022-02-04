import {useBiotope} from "../../../components/util/hooks";
import {useRouter} from "next/router";
import Link from 'next/link'
import {useSession} from "next-auth/react"
import {formatDistanceToNow} from "date-fns";
import React from "react";
import {cloudinaryUrl} from "../../../lib/constants";
import {ReactMarkdown} from "react-markdown/lib/react-markdown";

export default function BiotopeHome() {

    // Required = false -> session might be null
    const {data: session} = useSession({required: false})
    const {name} = useRouter().query
    const {biotope: b} = useBiotope(name as string)

    return !b ? null :
        <>
            <section className="hero-area pt-3 pb-3 hero-bg-1" style={b.headerPic && {
                backgroundImage: `url(${cloudinaryUrl}/image/upload/c_scale,e_sharpen:100,w_400,q_auto:good/${b.headerPic}.jpg)`
            }}>
                <div className="overlay"/>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-9">
                            <div className="hero-content">
                                <h2 className="section-title pb-3 text-white">{b.longName ? b.longName : b.name}</h2>
                                {b.description &&
                                <div className="section-desc text-white"><ReactMarkdown>{b.description}</ReactMarkdown></div>
                                }
                            </div>
                        </div>

                        {/*
                        CALL TO ACTION: Prenez quelques minutes pour participer à notre grande enquête 2022 !
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
                    </div>
                </div>
            </section>

            {
                !b.isAuthorized ?
                    <>
                        {session ?
                            <div>You are signed in but this is a private biotope. Request to join through the contact
                                information above.</div>
                            :
                            <div>Please
                                <Link href="/api/auth/signin" locale={false}>SIGN IN</Link>
                                to access this private biotope.
                            </div>}
                    </>
                    :

                    <section className="question-area">
                        <div className="container">
                            <div className="question-main-bar">
                                <div className="questions-snippet border-top border-top-gray">

                                    {b.questions && b.questions.map((question) => {

                                        const maxShortDescriptionLength = 200;
                                        question.shortDescription = question.description.length < maxShortDescriptionLength ? question.description : question.description.substring(0, maxShortDescriptionLength) + '…'

                                        return <div key={question.id}
                                                    className="d-flex media media-card rounded-0 shadow-none my-3 bg-transparent p-2 border-bottom border-bottom-gray">
                                            <div className="votes text-center votes-2">
                                                <div className="vote-block">
                                                    <span
                                                        className="vote-counts d-block text-center pr-0 lh-20 fw-medium">{question.votes}</span>
                                                    <span
                                                        className="vote-text d-block fs-13 lh-18">{question.votes > 1 ? 'votes' : 'vote'}</span>
                                                </div>
                                                {(question.closingDate || question.closed) &&
                                                <div
                                                    className={`answer-block ${question.closed ? 'closed' : 'answered'} my-2`}>
                                                    {question.closed
                                                    && <div>
                                                        <span className="answer-text d-block fs-13 lh-18">closed</span>
                                                        <span
                                                            className="answer-counts d-block lh-20 fw-medium">{formatDistanceToNow(new Date(question.closingDate), {addSuffix: false})}</span>
                                                        <span className="answer-text d-block fs-13 lh-18">ago</span>
                                                    </div>
                                                    }
                                                    {!question.closed && question.closingDate
                                                    && <div>
                                                        <span
                                                            className="answer-text d-block fs-13 lh-18">closes in</span>
                                                        <span
                                                            className="answer-counts d-block lh-20 fw-medium">{formatDistanceToNow(new Date(question.closingDate), {addSuffix: false})}</span>
                                                    </div>
                                                    }
                                                </div>
                                                }
                                            </div>
                                            <div className="media-body flex-grow-1">
                                                <h5 className="mb-2 fw-medium">
                                                    <Link href={`/b/${b.name}/q/${question.id}`}><a>{question.name}</a></Link>
                                                </h5>
                                                <p className="mb-2 truncate lh-20 fs-15">{question.shortDescription}</p>
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
                                                                    className="text-black d-block lh-18">last vote</span>
                                                                <span
                                                                    className="d-block lh-18 fs-12">{formatDistanceToNow(new Date(question.lastVoteDate), {addSuffix: true})}</span>
                                                            </small>
                                                            }
                                                            <small className="meta d-block text-right ps-3">
                                                                <span
                                                                    className="text-black d-block lh-18">asked</span>
                                                                <span
                                                                    className="d-block lh-18 fs-12">{formatDistanceToNow(new Date(question.createdOn), {addSuffix: true})}</span>
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