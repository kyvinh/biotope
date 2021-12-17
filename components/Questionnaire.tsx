import {Question} from "./Question";
import {QuestionResults} from "./QuestionResults";
import {Arguments} from "./Arguments";
import {fetcher} from "./util/fetcher";
import useSWR from "swr";
import React, {useState} from "react";
import {useSession} from "next-auth/react";
import Link from "next/link";

export const Questionnaire = ({question, disabled = false}) => {

    const [answer, setAnswer] = useState(null)
    const {data: session} = useSession({required: false})

    // Whether the user has answered this question or not
    const {data: questionHistory} = useSWR(session ? `/api/user/question/${question.id}` : null, fetcher);
    console.log('questionHistory', questionHistory)
    const questionAnswered = questionHistory?._count?.answers > 0

    // Results of the votes (include comments?) on this questionnaire
    // Type of resultsObject = { questionId: { average: Int }
    const {data: answerResults} = useSWR(session ? `/api/q/${question.id}/results` : null, fetcher);
    console.log('resultsObject', answerResults)

    const questionSubmit = async (event) => {
        event.preventDefault();
        event.target.disabled = true;

        if (session) {
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
        <h5>{question.name}</h5>
        <div className="card-body">
            <h6>{question.description}</h6>

            {!session ?
                <div>
                    <Link href="/api/auth/signin" locale={false}>
                        <a className="btn btn-outline-primary">Sign in</a>
                    </Link> to vote
                </div>
                : <>
                    <Question question={question} setState={setAnswer} answered={answer || questionAnswered}
                              showTitle={false} disabled={disabled}/>
                    <input type="submit" value="Submit" onClick={questionSubmit} disabled={disabled}/>
                </>
            }
            { answer && answerResults?
                <>
                    <QuestionResults question={question} results={answerResults}/>
                    <Arguments question={question} questionArguments={question.arguments} />
                </>
                : null
            }
        </div>
    </div>
};