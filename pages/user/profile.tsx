import {signOut, useSession} from 'next-auth/react'
import Link from "next/link";
import useSWR from "swr";
import {fetcher} from "../../components/util/fetcher";
import {ReactMarkdown} from "react-markdown/lib/react-markdown";
import messages from "../../lib/messages.fr";
import {EmailJoinForm} from "../../components/EmailJoinForm";

export default function Profile() {
    const {data: session} = useSession({required: false})
    const {data: biotopes,} = useSWR(`/api/user/memberships`, fetcher)

    return session?.user ? <>
        <div className="main-container">
            <div className="d-flex justify-content-between my-4">
                <h1 className="title text-center">{messages.user.hello} {session.user.name}!</h1>
                {session.user.isAnon &&
                    <button type="button" onClick={() => signOut({callbackUrl: '/'})}
                            className="btn btn-sm btn-outline-dark ms-2">{messages.user["signout-action"]} <i className="la la-sign-out"/></button>
                }
            </div>

            <EmailJoinForm/>

            <div className="main-biotope-cards my-2">
                <h2>{messages.user["your-biotopes"]}:</h2>
                {biotopes && biotopes.map(b => <div className="col gy-2" key={b.id}>
                        <div className="main-card">
                            <div className="card-body">
                                <h5 className="card-title"><Link href={`/b/${b.name}`}>{b.longName}</Link> &rarr;</h5>
                                <div className="card-text markdown"><ReactMarkdown>{b.description || ''}</ReactMarkdown></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </> : <></>
}