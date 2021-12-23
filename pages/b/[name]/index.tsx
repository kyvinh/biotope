import {useBiotope, useBiotopeUserHistory} from "../../../components/util/hooks";
import {useRouter} from "next/router";
import Link from 'next/link'
import {getSession, useSession} from "next-auth/react"
import React from "react";
import {QuestionContainer} from "../../../components/QuestionContainer";
import {UserFlair} from "../../../components/UserFlair";
import {formatDate} from "../../../components/util/dates";

export const getServerSideProps = async function ({req}) {

    // https://next-auth.js.org/tutorials/securing-pages-and-api-routes
    const session = await getSession({req})

    return {
        props: {session}
    }
}

export default function BiotopeHome() {

    // Required = false -> session might be null
    const {data: session} = useSession({required: false})

    let authorized = false;

    const {name} = useRouter().query

    const {biotope: b, reloadBiotope} = useBiotope(name as string)
    const {error: authorizationError} = useBiotopeUserHistory(name as string)

    if (session) {
        if (b?.public || !authorizationError) {
            authorized = true
        }
    }

    // TODO: How to make sure we only display public information until we have the certainty that the user is authorized?

    return b ?
            <div className="biotope-container">

                <div className="biotope-explainer-hero">
                    <div className="explainer-text">
                        <span><em>Biotope</em> est un site de sondage citoyen disponibles à tous les quartiers et associations de Bruxelles.</span>
                    </div>
                    <div className="explainer-side">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">Tout voisin peut lancer un sondage</li>
                            <li className="list-group-item">Tout voisin peut répondre aux sondages</li>
                            <li className="list-group-item">Tout voisin peut participer anonymement</li>
                        </ul>
                    </div>
                </div>

                <div className="biotope-hero">
                    {b.headerPic ?
                        <img className="biotope-logo" src={`/api/file/${b.headerPic}`} alt={`${b.name} header picture`}/>
                        : null
                    }
                    <div className="card-body">
                        <h5 className="card-title">{b.name}</h5>
                        { b.description ? <p className="card-text">{b.description}</p> : null}
                        <p className="card-text">

                            {b.contact ? <span>Contact: {b.contact}</span> : null}
                        </p>
                        <p className="card-text"><small className="text-muted">Biotope created by <UserFlair user={b.creator} theme="outline-light" /> on {formatDate(b.createdOn)}.&nbsp;</small></p>
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

                            <div><Link href={`/b/${b.name}/invite`}>Invite</Link></div>

                            <div>
                                {b.questions ? b.questions.map((question) => {
                                    const disabled = !authorized || !session;
                                    return <QuestionContainer key={question.id} question={question} disabled={disabled} onQuestionUpdated={reloadBiotope}/>
                                }) : null}
                            </div>
                        </>
                }

            </div>
        : null
}