import {fetcher} from "./util/fetcher";
import useSWR from "swr";
import React, {useState} from "react";
import {useSession} from "next-auth/react";
import {QuestionEdit} from "./QuestionEdit";

// TODO Prereq: we should not be here if no session and biotope is private

export const QuestionContainer = ({question, disabled = false, onQuestionUpdated}) => {

    const [isEditMode, setIsEditMode] = useState(false)
    const {data: session} = useSession({required: false})

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

        </div>
    </div>
};