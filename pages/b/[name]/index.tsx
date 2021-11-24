import {useBiotope} from "../../../components/util/hooks";
import {useRouter} from "next/router";
import Link from 'next/link'
import {getSession, useSession} from "next-auth/react"
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

    if (session) {
        if (b?.public || !authorizationError) {
            authorized = true
        }
    }

    return b ?
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
                        const disabled = !b.private && !session;
                        questionnaire.biotope = { name: b.name, id: b.id }; // Useless to reference the whole b object
                        return <Questionnaire key={questionnaire.id} questionnaire={questionnaire} disabled={disabled} />
                    }) : null}
                </div>
            </div>
        : null
}