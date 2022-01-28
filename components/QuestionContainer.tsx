import {QuestionResults} from "./QuestionResults";
import {fetcher} from "./util/fetcher";
import useSWR from "swr";
import React, {useState} from "react";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {QuestionEdit} from "./QuestionEdit";
import {ReactMarkdown} from "react-markdown/lib/react-markdown";

// TODO Prereq: we should not be here if no session and biotope is private

export const QuestionContainer = ({question, disabled = false, onQuestionUpdated}) => {

    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const {data: session} = useSession({required: false})

    // Whether the user has answered this question or not
    const {data: questionAnsweredObject} = useSWR(session ? `/api/user/question/${question.id}` : null, fetcher);
    const questionIsAnsweredKnown = !!questionAnsweredObject
    const questionAnswered = questionAnsweredObject?.answered

    // Results of the votes (include comments?) on this questionnaire
    // Type of resultsObject = { questionId: { average: Int }
    const {data: answerResults, mutate: reloadAnswerResults} = useSWR(session ? `/api/q/${question.id}/results` : null, fetcher);

    return <div className="questionnaire-container">
        <div className="card-body">
            {!isEditMode ?
                <>
                </>
                :
                <>
                    <QuestionEdit question={question}
                                  onCancel={async () => { setIsEditMode(false) } }
                                  onQuestionEdit={async () => { setIsEditMode(false); await onQuestionUpdated(); } }
                                  onAnswerEdit={async () => { await onQuestionUpdated(); await reloadAnswerResults(); } }
                    />
                </>
            }

            {!session &&
            <>
                <h6><ReactMarkdown>{question.description}</ReactMarkdown></h6>
                <Link href="/api/auth/signin" locale={false}>
                    <a className="btn btn-outline-primary">Sign in</a>
                </Link> to vote and see the results
            </>
            }

            { ((isSubmitted || questionAnswered || question.closed) && answerResults && !isEditMode && session) &&
                <>
                    <QuestionResults question={question} results={answerResults.results}
                                     onQuestionUpdated={async () => { await onQuestionUpdated() }} />
                </>
            }
        </div>
    </div>
};