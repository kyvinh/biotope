import { Question } from '../../../components/Question'
import {useBiotope} from "../../../components/util/hooks";
import {useRouter} from "next/router";
import Link from 'next/link'
import { getSession, useSession } from "next-auth/react"

export const getServerSideProps = async function ({ req }) {

    // https://next-auth.js.org/tutorials/securing-pages-and-api-routes
    const session = await getSession({ req })

    return {
        props: { session },
    }
}

export default function BiotopeHome() {

    const {data: session} = useSession({required: false})

    const { name } = useRouter().query
    const {biotope: b} = useBiotope(name)

    return b ?
        b.private && !session ?
            <>
                This is a private biotope. For more information: {b.contact}.
            </>
        :
            <div className="container">
                <div><h4>{b.name}</h4><span>{b.creator.name}</span> on {b.createdOn}</div>
                <div>{b.invitations ? b.invitations.length : "0"} invitation(s)</div>
                <div><Link href={`/b/${b.name}/invite`}>Invite</Link></div>
                { b.contact ?
                    <div>Contact possible: {b.contact}</div>
                    : <div/>}
                <div>
                { b.questionnaires ? b.questionnaires.map((questionnaire) => {
                    return <div key={questionnaire.id}>
                        <h5>{questionnaire.name}</h5>
                        { questionnaire.questions?.map((question) => {
                            question.questionnaire = questionnaire  // Fill the relation for rendering in Question comp
                            return <Question key={question.id} question={question} />
                        })}
                    </div>
                }) : null}
                </div>
            </div>
    : null
}