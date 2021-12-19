import {Question} from "./Question";
import {QuestionResults} from "./QuestionResults";
import {Arguments} from "./Arguments";
import {fetcher} from "./util/fetcher";
import useSWR from "swr";
import React, {useState} from "react";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {QuestionEdit} from "./QuestionEdit";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export const QuestionContainer = ({question, disabled = false}) => {

    const [answer, setAnswer] = useState(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const {data: session} = useSession({required: false})

    // Whether the user has answered this question or not
    const {data: questionAnsweredObject} = useSWR(session ? `/api/user/question/${question.id}` : null, fetcher);
    const questionAnswered = questionAnsweredObject?.answered

    // Results of the votes (include comments?) on this questionnaire
    // Type of resultsObject = { questionId: { average: Int }
    const {data: answerResults} = useSWR(session ? `/api/q/${question.id}/results` : null, fetcher);

    const answerSubmit = async () => {
        if (session) {
            setIsSubmitted(true)
            const res = await fetcher(`/api/q/${question.id}/answer`, { possibleAnswerId: answer});

            if (res?.status == 'ok') {
                // Answer has been recorded
            }

            console.log('Post-Answer:', res)
        } else {
            // how to handle anonymous answers? only available to certain types of questionnaires?
            // by default, there shall not be anonymous votes
            // - private biotopes cannot be accessed by anonymous users
            throw new Error("Currently no anonymous vote allowed!")
        }
    }

    return <div className="questionnaire-container">
        <h5>{question.name} <button className="btn-secondary btn-sm float-end" onClick={() => { setIsEditMode(!isEditMode)}}>edit</button></h5>
        <div className="card-body">
            { !isEditMode && <h6><ReactMarkdown>{question.description}</ReactMarkdown></h6> }

            {!session ?
                <div>
                    <Link href="/api/auth/signin" locale={false}>
                        <a className="btn btn-outline-primary">Sign in</a>
                    </Link> to vote
                </div>
                :
                <>
                    {isEditMode ?
                        <QuestionEdit question={question} />
                        :
                        <Question question={question} setState={setAnswer} answered={isSubmitted || questionAnswered}
                                  disabled={disabled} answerSubmit={answerSubmit} />
                    }
                </>
            }
            { ((isSubmitted || questionAnswered) && answerResults) ?
                <>
                    <QuestionResults question={question} results={answerResults.results}/>
                    <Arguments question={question} questionArguments={question.arguments} />
                </>
                : null
            }
        </div>
    </div>
};