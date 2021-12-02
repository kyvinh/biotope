import React from "react";
import {Col, ProgressBar, Row} from "react-bootstrap";

export const QuestionResults = ({question, results}) => {
    if (!results) {
        return null
    }
    /* results:
        [{…}, {…}, {…}]
        1: {questionId: 'ckw25piy00044c0uzlzqspuqp', answerText: "c'est sale", answerNum: null, _count: 1}
        2: {questionId: 'ckw25piy00044c0uzlzqspuqp', answerText: 'pas mal propre', answerNum: null, _count: 1}
    */

    const totalVotesCount = results.reduce((acc, result) => acc + result._count, 0)

    const options = question.possibleAnswers.reduce(
        (acc, possibleAnswer) => {

            const answerResult = { ...possibleAnswer }

            // The results for an answer is not linked with the original possible answer, so we need to copy its order, type, ...
            const rawResult = results.find(result => {
                // Even though the type may be PossibleAnswerType.NUMBER, we only keep the possible answer text. Shitty design?
                return possibleAnswer.possibleText === result.answerText
            })

            if (rawResult) {
                answerResult.count = rawResult._count
            } else {
                answerResult.count = 0
            }
            answerResult.percent = answerResult.count / totalVotesCount * 100


            return [...acc, answerResult]
        }
        , []).sort((n1,n2) => n1.order - n2.order)

    // console.log(options)
    /* Options: [{…}, {…}, {…}, {…}, {…}]
        0:
            count: 0
            id: "ckweupyuj0099p0uzilfx79ap"
            order: 1
            possibleNumber: 1
            possibleText: "Insalubre"
            questionId: "ckweupyu90091p0uzsjjobdl3"
            type: "NUMBER"
     */
    return <div className="py-2">
        <div >Résultats: {totalVotesCount} vote(s)</div>
        <div>
            { options.map((answerResult, i) =>
                <div key={i}>
                    <Row className="align-items-center">
                        <Col sm={2}>
                            <div>{answerResult.possibleText? answerResult.possibleText: answerResult.possibleNumber}:</div>
                        </Col>
                        <Col>
                            <ProgressBar now={answerResult.percent} label={answerResult.count} />
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    </div>
}