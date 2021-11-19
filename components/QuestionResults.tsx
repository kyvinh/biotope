export const QuestionResults = ({question, results}) => {
    // console.log(results)
    return <>
        {
            results.map((answerResult, i) => {
                return <div key={i}>
                    <p>{answerResult.answerText? answerResult.answerText: answerResult.answerNum}: {answerResult._count} vote(s)</p>
                </div>
            })
        }
    </>
}