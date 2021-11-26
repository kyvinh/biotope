import {useBiotope} from "../../../components/util/hooks";
import {useRouter} from "next/router";
import Link from 'next/link'
import {getSession, useSession} from "next-auth/react"
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
    // TODO Just fetch the 1st questionnaire?
    const {biotope: b} = useBiotope(name)
    // TODO This should be a query for privileges and user history on this biotope
    const {error: authorizationError} = useBiotope(name, true)

    if (session) {
        if (b?.public || !authorizationError) {
            authorized = true
        }
    }

    return b ?
            <div className="container-fluid">

                <div className="card biotope-hero-height bg-dark text-white">
                    {b.headerPic ?
                        <img className="card-img biotope-hero-height" src={`/api/file/${b.headerPic}`} alt={`${b.name} header picture`}/>
                        : null
                    }
                    <div className={`${b.headerPic? "card-img-overlay":""}`}>
                        <h5 className="card-title">{b.name}</h5>
                        { b.description ? <p className="card-text">{b.description}</p> : null}
                        <p className="card-text">
                            Biotope created by <span>{b.creator.name}</span> on {b.createdOn}.&nbsp;
                            {b.contact ? <span>Contact: {b.contact}</span> : null}
                        </p>
                    </div>
                </div>

                {
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
                        <>
                            {/*<div>{b.invitations ? b.invitations.length : "0"} invitation(s)</div>*/}

                            <div><Link href={`/b/${b.name}/invite`}>Invite</Link></div>

                            <div>
                                {b.questionnaires ? b.questionnaires.map((questionnaire) => {
                                    const disabled = !b.private && !session;
                                    questionnaire.biotope = { name: b.name, id: b.id }; // Useless to reference the whole b object
                                    return <Questionnaire key={questionnaire.id} questionnaire={questionnaire} disabled={disabled} />
                                }) : null}
                            </div>
                        </>
                }

                <style jsx>{`
                  .biotope-hero-height {
                    max-height: 15rem;
                  }
                `}</style>

            </div>
        : null
}