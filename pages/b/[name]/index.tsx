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