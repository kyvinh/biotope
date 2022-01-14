import {newAnswerCheckProp, newAnswerTextProp, Question} from "./Question";
import {QuestionResults} from "./QuestionResults";
import {fetcher} from "./util/fetcher";
import useSWR from "swr";
import React, {useState} from "react";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {QuestionEdit} from "./QuestionEdit";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import {UserFlair} from "./UserFlair";
import {formatDistanceToNow} from 'date-fns'
import {AnswerDto} from "../pages/api/q/[q]/answer";

export const QuestionContainer = ({question, disabled = false, onQuestionUpdated}) => {

    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const {data: session} = useSession({required: false})

    // Whether the user has answered this question or not
    const {data: questionAnsweredObject} = useSWR(session ? `/api/user/question/${question.id}` : null, fetcher);
    const questionAnswered = questionAnsweredObject?.answered

    // Results of the votes (include comments?) on this questionnaire
    // Type of resultsObject = { questionId: { average: Int }
    const {data: answerResults, mutate: reloadAnswerResults} = useSWR(session ? `/api/q/${question.id}/results` : null, fetcher);

    const answerSubmit = async (values) => {
        /*
        console.log(values)
        For dynamic questions: {
            "question-ckxd4l25p0053i4uzwit3vy0p": {
                "ckxd4wtfc0063ekuzl19g8dax": false,
                "ckxd4wtfc0063ekuzl19g8qwe": true,
                newAnswerCheck: "true",
                newAnswerText: "new answer is here"
            }
        }
        */
        if (session) {
            let hasNewAnswer = false
            let newAnswerText = ''
            const possibleAnswerIds:string[] = Object.entries(values[`question-${question.id}`]).reduce((acc, [key, value])=> {
                if (key === newAnswerCheckProp) {
                    hasNewAnswer = value as boolean;
                } else if (key === newAnswerTextProp) {
                    newAnswerText = value as string;
                } else if (value) {
                    acc.push(key)
                }
                return acc
            }, [])
            setIsSubmitted(true)

            const payload:AnswerDto = {
                possibleAnswerIds
            }
            if (hasNewAnswer) {
                payload.newAnswer = {
                    text: newAnswerText
                }
            }
            const res = await fetcher(`/api/q/${question.id}/answer`, payload);

            if (res?.status == 'ok') {
                // Answer has been recorded
                onQuestionUpdated()
                await reloadAnswerResults()
            }

            // console.log('Post-Answer:', res)

        } else {
            // how to handle anonymous answers? only available to certain types of questionnaires?
            // by default, there shall not be anonymous votes
            // - private biotopes cannot be accessed by anonymous users
            throw new Error("Currently no anonymous vote allowed!")
        }
    }

    return <div className="questionnaire-container">
        <div className="card-header">
            <h5>{question.name}
                { !isEditMode && question.creator.id === session?.user.id &&
                <button className="btn-secondary btn-sm float-end" onClick={() => { setIsEditMode(!isEditMode)} }>edit</button>
                }
            </h5>
        </div>
        <div className="card-body">
            <div className="item-summary-dates">
                <div>Asked {formatDistanceToNow(new Date(question.createdOn), {addSuffix: true})} by <UserFlair user={question.creator} /></div>
                {question.lastVoteDate
                && <div>Last vote {formatDistanceToNow(new Date(question.lastVoteDate), {addSuffix: true})}</div>}
            </div>

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
                        <QuestionEdit question={question}
                                      onCancel={async () => { setIsEditMode(false) } }
                                      onQuestionEdit={async () => { setIsEditMode(false); await onQuestionUpdated(); } }
                                      onAnswerEdit={async () => { setIsEditMode(false); await reloadAnswerResults(); } }
                        />
                        :
                        <Question question={question} answered={isSubmitted || questionAnswered}
                                  disabled={disabled} answerSubmit={answerSubmit}/>
                    }
                </>
            }
            { ((isSubmitted || questionAnswered) && answerResults && !isEditMode) ?
                <>
                    <QuestionResults question={question} results={answerResults.results}
                                     onQuestionUpdated={async () => { await onQuestionUpdated() }} />
                </>
                : null
            }
        </div>
    </div>
};