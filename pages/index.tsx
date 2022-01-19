import Link from 'next/link'
import {fetcher} from "../components/util/fetcher";
import {signIn, useSession} from "next-auth/react";

export default function Home() {

    const join = async (event) => {
        const code = event.target.invitationCode.value
        event.preventDefault()

        const result = await signIn("code-credentials", {
            redirect: false,
            code: code,
        });
        // console.log("code signin result:", result)
/*
        const res = await fetcher(`/api/b/codeJoin`, {
            code: code,
        })
        if (res?.status == 'ok') {
            console.log(res)
        }
*/
    }

    const session = useSession({required: false})
    console.log(session)

    return (
        <div className="main-container">
            <h1 className="title text-center">Sondages Citoyens pour Tous!</h1>

            <div>
                <form onSubmit={join}>
                    <label htmlFor="invitationCode">Invitation code:</label>
                    <input name="invitationCode" id="invitationCode" required/>
                    <button type="submit">Join</button>
                </form>
            </div>

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
