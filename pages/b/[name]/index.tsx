import {Question} from '../../../components/Question'
import {useBiotope} from "../../../components/util/hooks";
import {useRouter} from "next/router";
import Link from 'next/link'
import {getSession, useSession} from "next-auth/react"
import {useState} from "react";
import {fetcher} from "../../../components/util/fetcher";
import useSWR from "swr";

export const getServerSideProps = async function ({req}) {

    // https://next-auth.js.org/tutorials/securing-pages-and-api-routes
    const session = await getSession({req})

    return {
        props: {session}
    }
}

export default function BiotopeHome() {

    const {data: session, status} = useSession({required: false})
    const [answers, setAnswers] = useState([])

    if (status === "loading") {
        return null
    }

    let authorized = false;

    const {name} = useRouter().query
    const {biotope: b} = useBiotope(name)
    const {error: authorizationError} = useBiotope(name, true)  // TODO This should be a query for privileges and user history on this biotope

    // typeof questionnairesAnswered = [ { questionnaireId, answerCount} ]
    const {data: questionnairesAnswered} = useSWR(session ? `/api/user/b-answers?biotopeName=${name}` : null, fetcher);    // If error occurs, means user is not signed in

    if (session) {
        if (b?.public || !authorizationError) {
            authorized = true
        }
    }

    const questionnaireSubmit = async (event, questionnaireId) => {
        event.preventDefault();

        const res = await fetcher(`/api/b/${name}/${questionnaireId}/answer`, { answers: answers});

        if (res?.status == 'ok') {
            // Answers submitted
        }
    }

    const setAnswer = (questionId, answer) => {
        let newAnswers = answers.filter(element => element.questionId != questionId)
        newAnswers.push({
            questionId: questionId,
            answer: answer
        });
        setAnswers(newAnswers)
    }

    return b ?
        b.private && !authorized ?
            <>
                This is a private biotope. <Link href="/api/auth/signin">Sign-in?</Link>
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
                    {b.questionnaires && questionnairesAnswered ? b.questionnaires.map((questionnaire) => {
                        if (questionnairesAnswered.find(element => element.questionnaireId == questionnaire.id)) {
                            // Questionnaire already answered
                            return <div key={questionnaire.id}>
                                        <h5>{questionnaire.name}</h5>
                                        <p>{questionnaire.welcomeText}</p>
                                        {questionnaire.questions?.map((question) => {
                                            return <div key={question.id}>Question answered</div>
                                        })}
                                    </div>
                        } else {
                            return <div key={questionnaire.id}>
                                <form onSubmit={e => questionnaireSubmit(e, questionnaire.id)}>
                                    <h5>{questionnaire.name}</h5>
                                    <p>{questionnaire.welcomeText}</p>
                                    {questionnaire.questions?.map((question) => {
                                        return <Question key={question.id} question={question} setState={setAnswer}/>
                                    })}
                                    <input type="submit" value="Submit" />
                                </form>
                            </div>
                        }
                    }) : null}
                </div>
            </div>
        : null
}