import {useBiotope, useBiotopeUserHistory} from "../../../components/util/hooks";
import {useRouter} from "next/router";
import Link from 'next/link'
import {useSession} from "next-auth/react"
import React from "react";
import {UserFlair} from "../../../components/UserFlair";
import {formatDate} from "../../../components/util/dates";
import {formatDistanceToNow} from "date-fns";

export function isAuthorized(session, biotope, authorizationError) {
    let authorized = false;
    if (session) {
        if (biotope?.public || !authorizationError) {
            authorized = true
        }
    }
    return authorized;
}
export default function BiotopeHome() {

    // Required = false -> session might be null
    const {data: session} = useSession({required: false})
    const {name} = useRouter().query
    const {biotope: b} = useBiotope(name as string)
    const {error: authorizationError} = useBiotopeUserHistory(name as string)

    let authorized = isAuthorized(session, b, authorizationError)

    // TODO: How to make sure we only display public information until we have the certainty that the user is authorized?

    return b ?
            <div className="biotope-container">

                <div className="biotope-explainer-hero">
                    <div className="explainer-text">
                        <span><em>Biotope</em> est un site de sondage citoyen disponible à tous les quartiers et associations de Bruxelles.</span>
                    </div>
                    <div className="explainer-side">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">Tout voisin peut <Link href={`/b/${b.name}/create`}>lancer un sondage</Link></li>
                            <li className="list-group-item">Tout voisin peut répondre aux sondages</li>
                            <li className="list-group-item">Tout voisin peut participer anonymement (<Link href={`/b/${b.name}/invite`}>inviter un voisin</Link>)</li>
                        </ul>
                    </div>
                </div>

                <div className="biotope-header-columns">
                    <div className="biotope-logo">
                        {b.headerPic ?
                            <img className="biotope-logo" src={`/api/file/${b.headerPic}`} alt={`${b.name} header picture`}/>
                            : null
                        }
                    </div>
                    <div className="biotope-intro">
                        <h5>{b.name}</h5>
                        { b.description ? <p>{b.description}</p> : null}
                        <p>

                            {b.contact ? <span>Contact: {b.contact}</span> : null}
                        </p>
                        <small className="text-muted">Biotope created by <UserFlair user={b.creator} /> on {formatDate(b.createdOn)}.&nbsp;</small>
                    </div>
                </div>

                {
                    b.private && !authorized ?
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

                                        return <div className="questions-list-item">
                                            <div className="question-item-stats">
                                                <h6><em>{question.votes}</em> votes</h6>
                                            </div>
                                            <div className="question-item-summary">
                                                <div><Link href={`/b/${b.name}/q/${question.id}`}>{question.name}</Link></div>
                                                <div>{question.shortDescription}</div>
                                                <div className="item-summary-dates">
                                                    <div>Asked {formatDistanceToNow(new Date(question.createdOn), {addSuffix: true})}
                                                    {question.lastVoteDate
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
        : null
}