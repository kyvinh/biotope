import {Question} from '../../../components/Question'
import {useBiotope} from "../../../components/util/hooks";
import {useRouter} from "next/router";
import Link from 'next/link'
import {getSession, useSession} from "next-auth/react"
import {useState} from "react";
import {fetcher} from "../../../components/util/fetcher";
import useSWR from "swr";
import {Questionnaire} from "../../../components/Questionnaire";

export const getServerSideProps = async function ({req}) {

    // https://next-auth.js.org/tutorials/securing-pages-and-api-routes
    const session = await getSession({req})

    return {
        props: {session}
    }
}

export default function BiotopeHome() {

    const {data: session} = useSession({required: false})

    let authorized = false;

    const {name} = useRouter().query
    const {biotope: b} = useBiotope(name)
    const {error: authorizationError} = useBiotope(name, true)  // TODO This should be a query for privileges and user history on this biotope

    // Type of questionnairesAnswered = [ { questionnaireId, answerCount} ]
    const {data: questionnairesAnswered} = useSWR(session ? `/api/user/b-answers?biotopeName=${name}` : null, fetcher);

    if (session) {
        if (b?.public || !authorizationError) {
            authorized = true
        }
    }

    const questionnaireSubmit = async (event, questionnaireId, answers) => {
        event.preventDefault();

        if (session) {
            const res = await fetcher(`/api/b/${name}/${questionnaireId}/answer`, { answers: answers});

            if (res?.status == 'ok') {
                // Answers submitted
            }
        } else {
            // how to handle anonymous answers? only available to certain types of questionnaires?
            // by default, there shall not be anonymous votes
            // - private biotopes cannot be accessed by anonymous users
            throw new Error("Currently no anonymous vote allowed!")
        }
    }

    return b ?
        b.private && !authorized ?
            <>
                {session ? <div>You are signed in but this is a private biotope.</div>
                :
                    <div>Please
                        <Link href="/api/auth/signin">SIGN IN</Link>
                        to access this private biotope.
                    </div>}
                <p>Or for more information: {b.contact}.</p>
            </>
            :
            <div className="container">
                <div><h4>{b.name}</h4><span>{b.creator.name}</span> on {b.createdOn}</div>
                <div>{b.invitations ? b.invitations.length : "0"} invitation(s)</div>

                <div className="card">
                    {   session?
                            <p>Vous êtes enregistré sous l'email {session.user.email}.</p>
                            : null
                    }
                </div>

                <div><Link href={`/b/${b.name}/invite`}>Invite</Link></div>
                {b.contact ?
                    <div>Contact possible: {b.contact}</div>
                    : <div/>
                }
                <div>
                    {b.questionnaires ? b.questionnaires.map((questionnaire) => {
                        const questionnaireAnswered = questionnairesAnswered?.find(element => element.questionnaireId == questionnaire.id);
                        const disabled = !b.private && !session;
                        questionnaire.biotope = { name: b.name, id: b.id }; // Useless to reference the whole b object
                        return <Questionnaire key={questionnaire.id} questionnaire={questionnaire} disabled={disabled}
                                              questionnaireSubmit={questionnaireSubmit} answered={questionnaireAnswered} />
                    }) : null}
                </div>
            </div>
        : null
}