import React from "react";
import {Col, ProgressBar, Row} from "react-bootstrap";

export const QuestionResults = ({question, results}) => {
    if (!results) {
        return null
    }
    /* results:
        PossibleAnswers[
            id: "ckweupyty0084p0uz1ugb3zcy"
            order: 1
            possibleNumber: 1
            possibleText: "Insalubre"
            questionId: "ckweupytg0076p0uz3j7ygwm2"
            type: "NUMBER"
            _count: {answers: 0}
        ]
    */

    const totalVotesCount = results.reduce((acc, result) => acc + result._count.answers, 0)

    const options = results.reduce(
        (acc, possibleAnswer) => {
            const answerResult = { ...possibleAnswer }
            answerResult.count = possibleAnswer._count.answers
            answerResult.percent = answerResult.count / totalVotesCount * 100
            return [...acc, answerResult]
        }
        , []).sort((n1,n2) => n1.order - n2.order)

    console.log(options)

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