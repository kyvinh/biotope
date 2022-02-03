import {useSession} from 'next-auth/react'
import Link from "next/link";
import useSWR from "swr";
import {fetcher} from "../../components/util/fetcher";
import {ReactMarkdown} from "react-markdown/lib/react-markdown";

export default function Profile() {
    const {data: session} = useSession({required: false})
    const {data: biotopes,} = useSWR(`/api/user/memberships`, fetcher)

    return session?.user ? <>
        <div className="main-container">
            <h1 className="title text-center">Hello {session.user.name}!</h1>

            <div className="main-biotope-cards">

                {biotopes && biotopes.map(b => <div className="col" key={b.id}>
                        <div className="main-card">
                            <div className="card-body">
                                <h5 className="card-title"><Link href={`/b/${b.name}`}>{b.longName}</Link> &rarr;</h5>
                                <p className="card-text"><ReactMarkdown>{b.description || ''}</ReactMarkdown></p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </> : <></>
}