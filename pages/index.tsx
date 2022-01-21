import Link from 'next/link'
import React from "react";
import {CodeJoinForm} from "../components/CodeJoinForm";

export default function Home() {

    return (
        <div className="main-container">
            <h1 className="title text-center">Sondages Citoyens pour Tous!</h1>

            <CodeJoinForm />

            <div className="main-biotope-cards">

                <div className="col">
                    <div className="main-card">
                        <div className="card-body">
                            <h5 className="card-title"><Link href="/b/bx">Biotope BX</Link> &rarr;</h5>
                            <p className="card-text">Le biotope BX est public et comprend plus de 500 membres.</p>
                        </div>
                    </div>
                </div>

                <div className="col">
                    <div className="main-card">
                        <div className="card-body">
                            <h5 className="card-title"><Link href="/b/terlinden-1040">Biotope Terlinden</Link> &rarr;
                            </h5>
                            <p className="card-text">Le biotope Terlinden est privé (seulement sur invitation) et
                                comprend 25 membres.</p>
                        </div>
                    </div>
                </div>

                <div className="col">
                    <div className="main-card">
                        <div className="card-body">
                            <h5 className="card-title"><Link href="/b/qqpart-1030">Biotope 1030</Link> &rarr;</h5>
                            <p className="card-text">Le biotope 1030 est privé (seulement sur invitation) et comprend 25
                                membres.</p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
