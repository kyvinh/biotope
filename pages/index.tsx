import {CodeJoinForm} from "../components/CodeJoinForm";

export default function Home() {

    return <div className="main-container">

            <h1 className="title text-center py-3">Sondages de Proximité</h1>

            <CodeJoinForm />

            <div className="biotope-explainer-hero">
                <div className="explainer-text">
                    <span><em>Biotope</em> est un site de sondage citoyen disponible à tous les quartiers et associations de Bruxelles.</span>
                </div>
                <div className="explainer-side">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Tout voisin peut lancer un sondage</li>
                        <li className="list-group-item">Tout voisin peut répondre aux sondages</li>
                        <li className="list-group-item">Tout voisin peut inviter des membres</li>
                        <li className="list-group-item">Tout voisin peut participer anonymement</li>
                    </ul>
                </div>
            </div>

        </div>
}
