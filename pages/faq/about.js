import messages from "../../lib/messages.fr";
import {useEffect} from "react";

export default function AboutPage() {

    // Place this in the pages/_app.js file
    useEffect(() => {
        import("bootstrap/js/dist/collapse");
    }, []);

    return <div className="container py-3">
        <div className="hero-content text-center mb-4">
            <h2 className="section-title pb-3">{messages.info["about-header"]}</h2>
            <p className="section-desc mb-2">
                {messages.info["about-text"]}
            </p>
            <p className="section-desc mb-2">
                {messages.info["contact-us"]}: <a href="mailto:info@biotope.brussels" className="text-color hover-underline">info@biotope.brussels</a>
            </p>
        </div>
        <div id="accordion" className="generic-accordion">
            <div className="card">
                <div className="card-header" id="headingOne">
                    <button className="btn" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        <span>Pourquoi un autre outil de formulaire/sondage?</span>
                        <i className="la la-angle-down collapse-icon"/>
                    </button>
                </div>
                <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                    <div className="card-body">
                        <p className="fs-15 lh-24">Des outils en ligne comme Google Forms, Framaforms ou Yakforms existent déjà pour envoyer des formulaires en ligne.
                        Ces outils sont utiles pour qu'une personne puisse récolter des avis et commentaires d'un groupe mais ne permettent pas aux répondants de
                        s'impliquer dans le sondage.<br /><br/>Afin de créer un environnement plus propice à la délibération et à la participation,
                            Biotope rajoute des fonctionnalités collaboratives aux sondages traditionnels:</p>
                        <ul className="generic-list-item generic-list-item-bullet fs-15 pt-3">
                            <li>Les répondants peuvent rajouter des réponses possibles aux sondages. Cela permet aux sondages exploratoires par exemple de proposer plus de réponses spécifiques. Cela permet aussi aux questions d'être moins biaisées, car plus ouvertes à des réponses alternatives.</li>
                            <li>Les répondants peuvent argumenter et commenter les résultats. Ces fonctionnalités d'argumentation sont nécessaires dans un débat démocratique et permettent de convaincre d'autres répondants de s'impliquer plus.</li>
                            <li>Les résultats sont directement consultables par les répondants. Dans un souci d'ouverture, les répondants doivent avoir un accès aux données autant que les créateurs du sondage.</li>
                            <li>Les répondants peuvent publier leurs propres questions afin de directement rentrer en contact avec leur groupe, plutôt que de passer par un intermédiaire.</li>
                        </ul>
                        <p className="fs-15 lh-24">La plateforme encourage donc un processus continu de débat d'opinions, plutôt que des implications isolées et ponctuelles.</p>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-header" id="headingTwo">
                    <button className="btn" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                        <span>Sécurité des données personnelles</span>
                        <i className="la la-angle-down collapse-icon"/>
                    </button>
                </div>
                <div id="collapseTwo" className="collapse show" aria-labelledby="headingTwo" data-parent="#accordion">
                    <div className="card-body">
                        <p className="fs-15 lh-24">Biotope attache énormément d'importance aux données à caractère personnel:</p>
                        <ul className="generic-list-item generic-list-item-bullet fs-15 pt-3">
                            <li>Les réponses aux questionnaires et les commentaires sont anonymisés.</li>
                            <li>Les questionnaires sont accessibles anonymement (avec un code si les questionnaires sont privés).</li>
                            <li>Aucun service externe n'est utilisé: pas de pub, pas de Google Analytics ou Facebook tracking, pas de cookies tiers.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-header" id="headingThree">
                    <button className="btn" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                        <span>But non lucratif</span>
                        <i className="la la-angle-down collapse-icon"/>
                    </button>
                </div>
                <div id="collapseThree" className="collapse show" aria-labelledby="headingThree" data-parent="#accordion">
                    <div className="card-body">
                        <p className="fs-15 lh-24">Le développement et la mise à disposition de Biotope sont à but non lucratif.
                            Le logiciel est disponible en source libre sur <a href="https://github.com/kyvinh/biotope" target="_blank">GitHub</a>.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
}