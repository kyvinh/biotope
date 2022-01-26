import {useBiotope} from "../../../components/util/hooks";
import {useRouter} from "next/router";
import Link from 'next/link'
import {useSession} from "next-auth/react"
import {UserFlair} from "../../../components/UserFlair";
import {formatDate} from "../../../components/util/dates";
import {formatDistanceToNow} from "date-fns";
import React from "react";

export default function BiotopeHome() {

    // Required = false -> session might be null
    const {data: session} = useSession({required: false})
    const {name} = useRouter().query
    const {biotope: b} = useBiotope(name as string)

    return !b ? null :
        <>
            <section className="hero-area bg-white shadow-sm pt-10px pb-10px">
                <div className="container">
                    <div className="hero-content">

                        <div className="row align-items-center">
                            <div className="col-lg-5 ml-auto">
                                <div className="img-box">
                                    {b.headerPic &&
                                        <img className="w-100 rounded-rounded lazy" src={`/api/file/${b.headerPic}`} alt={`${b.name} header picture`}/>
                                    }
                                </div>
                            </div>
                            <div className="col-lg-5">
                                <div className="hero-content py-5">
                                    <h2 className="section-title fs-30">{b.name}</h2>
                                    { b.description && <p className="section-desc pb-3">{b.description}</p>}
                                    { b.contact && <p className="text-muted">Contact: {b.contact}</p>}
                                    <p className="text-muted">Biotope created by <UserFlair user={b.creator} /> on {formatDate(b.createdOn)}.&nbsp;</p>
                                    <p className="section-desc text-black">472,665 Questions</p>
                                    <div>
                                        <Link href={`/b/${b.name}/invite`}>inviter un voisin</Link> -
                                        <Link href={`/b/${b.name}/create`}>lancer un sondage</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="question-area">
                <div className="container">
                    <div className="question-main-bar pt-40px pb-40px">
                        <div className="questions-snippet border-top border-top-gray">

                            {b.questions && b.questions.map((question) => {

                                const maxShortDescriptionLength = 200;
                                question.shortDescription = question.description.length < maxShortDescriptionLength ? question.description : question.description.substring(0, maxShortDescriptionLength) + '…'

                                return <div key={question.id} className="d-inline-flex media media-card rounded-0 shadow-none mb-0 bg-transparent p-2 border-bottom border-bottom-gray">
                                    <div className="votes text-center votes-2">
                                        <div className="vote-block">
                                            <span className="vote-counts d-block text-center pr-0 lh-20 fw-medium">{question.votes}</span>
                                            <span className="vote-text d-block fs-13 lh-18">votes</span>
                                        </div>
                                        <div className="answer-block answered my-2">
                                            <span className="answer-counts d-block lh-20 fw-medium">?</span>
                                            <span className="answer-text d-block fs-13 lh-18">answers</span>
                                        </div>
                                        <div className="view-block">
                                            <span className="view-counts d-block lh-20 fw-medium">?</span>
                                            <span className="view-text d-block fs-13 lh-18">views</span>
                                        </div>
                                    </div>
                                    <div className="media-body">
                                        <h5 className="mb-2 fw-medium">
                                            <Link href={`/b/${b.name}/q/${question.id}`}><a>{question.name}</a></Link>
                                        </h5>
                                        <p className="mb-2 truncate lh-20 fs-15">{question.shortDescription}</p>
                                        <div className="tags">
                                            {question.tags.map((tag) => <a href="#" className="tag-link">{tag.name}</a>)}
                                        </div>
                                        <div className="media media-card user-media align-items-center px-0 border-bottom-0 pb-0">
                                            <a href="user-profile.html" className="media-img d-block">
                                                <img src="images/img3.jpg" alt="avatar" />
                                            </a>
                                            <div className="media-body d-flex flex-wrap align-items-center justify-content-between">
                                                <div>
                                                    <h5 className="pb-1"><a href="user-profile.html">Arden Smith</a></h5>
                                                    <div className="stats fs-12 d-flex align-items-center lh-18">
                                                        <span className="text-black pr-2" title="Reputation score">224</span>
                                                        <span className="pr-2 d-inline-flex align-items-center" title="Gold badge"><span className="ball gold"/>16</span>
                                                        <span className="pr-2 d-inline-flex align-items-center" title="Silver badge"><span className="ball silver"/>93</span>
                                                        <span className="pr-2 d-inline-flex align-items-center" title="Bronze badge"><span className="ball"/>136</span>
                                                    </div>
                                                </div>
                                                <small className="meta d-block text-right">
                                                    <span className="text-black d-block lh-18">asked</span>
                                                    <span className="d-block lh-18 fs-12">6 hours ago</span>
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <div className="biotope-container">

                {session?.user?.isAnon &&
                <div>
                    You have been invited to participate in this biotope. What you can do... what is expected from the platform...
                </div>
                }

                {
                    !b.isAuthorized ?
                        <>
                            {session ? <div>You are signed in but this is a private biotope.</div>
                                :
                                <div>Please
                                    <Link href="/api/auth/signin" locale={false}>SIGN IN</Link>
                                    to access this private biotope.
                                </div>}
                            <p>Or for more information: {b.contact}.</p>
                        </>
                        :
                        <>
                            {/*<div>{b.invitations ? b.invitations.length : "0"} invitation(s)</div>*/}

                            <div>
                                <h5>Questions:</h5>
                                <div className="btn-group" role="group" aria-label="Questions filter">
                                    <button type="button" className="btn btn-outline-dark active">Unanswered</button>
                                    <button type="button" className="btn btn-outline-dark">Latest</button>
                                    <button type="button" className="btn btn-outline-dark">Active</button>
                                    <button type="button" className="btn btn-outline-dark">Historique</button>
                                </div>

                                <div className="questions-list">
                                    {b.questions ? b.questions.map((question) => {

                                        const maxShortDescriptionLength = 200;
                                        question.shortDescription = question.description.length < maxShortDescriptionLength ? question.description : question.description.substring(0, maxShortDescriptionLength) + '…'

                                        return <div className="questions-list-item" key={question.id}>
                                            <div className="question-item-stats">
                                                <h6><em>{question.votes}</em> votes</h6>
                                            </div>
                                            <div className="question-item-summary">
                                                <div><Link href={`/b/${b.name}/q/${question.id}`}>{question.name}</Link></div>
                                                <div>{question.shortDescription}</div>
                                                <div className="item-summary-dates">
                                                    <div>Asked {formatDistanceToNow(new Date(question.createdOn), {addSuffix: true})}
                                                        { question.closed
                                                        && <span>, closed {formatDistanceToNow(new Date(question.closingDate), {addSuffix: true})}</span>}
                                                        { !question.closed && question.closingDate
                                                        && <span>, closes in {formatDistanceToNow(new Date(question.closingDate), {addSuffix: true})}</span>}
                                                        { question.lastVoteDate
                                                        && <span>, last vote {formatDistanceToNow(new Date(question.lastVoteDate), {addSuffix: true})}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }) : null}
                                </div>
                            </div>
                        </>
                }

            </div>
        </>
}