import React from "react";

export const QuestionResults = ({results}) => {
    if (!results) {
        return null
    }

    // console.log(results)
    return <>
        { results.map((answerResult, i) =>
            <div key={i}>
                <p>{answerResult.answerText? answerResult.answerText: answerResult.answerNum}: {answerResult._count} vote(s)</p>
            </div>
        )}
    </>
}