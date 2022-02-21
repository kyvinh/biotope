import {CodeJoinForm} from "../components/CodeJoinForm";
import messages from "../lib/messages.fr";
import Link from "next/link";
import {useSession} from "next-auth/react";

export default function Home() {

    const {data: session} = useSession({required: false})
    const userLoggedIn = !!session?.user

    return <div className="main-container">

            <h1 className="title text-center py-3">{messages.general["short-slug"]}</h1>

            <div className="biotope-explainer-hero">
                <div className="explainer-text">
                    <span><em>Biotope</em> est un site de sondage participatif disponible à tous les quartiers et associations de Bruxelles.</span>
                </div>

                <CodeJoinForm />

                {!userLoggedIn &&
                    <div className="explainer-text">
                        Ou <Link href="/api/auth/signin" locale={false}>
                        <a className="btn btn-outline-primary mx-2"><i
                            className="la la-sign-in mr-1"/> {messages.user["signin-action-phrase"]}</a>
                    </Link>
                        si vous êtes déjà inscrit.
                    </div>
                }

                {userLoggedIn &&
                    <Link href="/user/profile">Allez à votre profil</Link>
                }

                {/*
                <div className="explainer-side">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Tout voisin peut lancer un sondage</li>
                        <li className="list-group-item">Tout voisin peut répondre aux sondages</li>
                        <li className="list-group-item">Tout voisin peut inviter des membres</li>
                        <li className="list-group-item">Tout voisin peut participer anonymement</li>
                    </ul>
                </div>
*/}
            </div>

        </div>
}
