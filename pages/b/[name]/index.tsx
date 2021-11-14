import {Question} from '../../../components/Question'
import {useBiotope} from "../../../components/util/hooks";
import {useRouter} from "next/router";
import Link from 'next/link'
import {getSession, useSession} from "next-auth/react"
import React from "react";

export const getServerSideProps = async function ({req}) {

    // https://next-auth.js.org/tutorials/securing-pages-and-api-routes
    const session = await getSession({req})

    return {
        props: {session}
    }
}

export default function BiotopeHome() {

    const {data: session, status} = useSession({required: false})

    if (status === "loading") {
        return null
    }

    let authorized = false;

    const {name} = useRouter().query
    const {biotope: b} = useBiotope(name, true)

    if (session) {
        if (b?.invitations) {
            if (b.invitations.length > 0) {
                // user has been invited here
                authorized = true
            }
        }
    }

    const questionnaireSubmit = (evt) => {
        evt.preventDefault();
        alert(`Submitting Name: ${name}`)
    }

    return b ?
        b.private && !authorized ?
            <>
                This is a private biotope. <Link href="/api/auth/signin">Sign-in?</Link>
                <p>Or for more information: {b.contact}.</p>
            </>
            :
            <div className="container">
                <div><h4>{b.name}</h4><span>{b.creator.name}</span> on {b.createdOn}</div>
                <div>{b.invitations ? b.invitations.length : "0"} invitation(s)</div>

                <div className="card">
                    <p>Vous êtes enregistré sous l'email {session.user.email}.</p>
                </div>

                <div><Link href={`/b/${b.name}/invite`}>Invite</Link></div>
                {b.contact ?
                    <div>Contact possible: {b.contact}</div>
                    : <div/>
                }
                <div>
                    {b.questionnaires ? b.questionnaires.map((questionnaire) => {
                        return <div key={questionnaire.id}>
                            <form onSubmit={questionnaireSubmit}>

                                <h5>{questionnaire.name}</h5>
                                {questionnaire.questions?.map((question) => {
                                    question.questionnaire = questionnaire  // Fill the relation for rendering in Question comp
                                    return <Question key={question.id} question={question}/>
                                })}

                                <input type="submit" value="Submit" />

                            </form>
                        </div>
                    }) : null}
                </div>
            </div>
        : null
}