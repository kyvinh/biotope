import React from "react";
import {Col, ProgressBar, Row} from "react-bootstrap";
import {Arguments} from "./Arguments";

export const QuestionResults = ({question, results: rawResults}) => {
    if (!rawResults) {
        return null
    }
    /* rawResults:
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

    const totalVotesCount = rawResults.reduce((acc, result) => acc + result._count.answers, 0)

    const answerResults = rawResults.reduce(
        (acc, rawResult) => {
            const possibleAnswer = question.possibleAnswers.find(element => element.id === rawResult.id)
            const answerResult = { ...possibleAnswer }
            answerResult.count = rawResult._count.answers
            answerResult.percent = answerResult.count / totalVotesCount * 100
            return [...acc, answerResult]
        }
        , []).sort((n1,n2) => n1.order - n2.order)

    return <div className="py-2">
        <div >Résultats: {totalVotesCount} vote(s)</div>
        <div>
            { answerResults.map((answerResult, i) =>
                <div key={i}>
                    <Row className="align-items-center">
                        <Col sm={2}>
                            <div>{answerResult.possibleText? answerResult.possibleText: answerResult.possibleNumber}:</div>
                        </Col>
                        <Col>
                            <ProgressBar now={answerResult.percent} label={answerResult.count} />
                        </Col>
                    </Row>
                    <Row className="align-items-center">
                        <Col sm={2}>
                        </Col>
                        <Col>
                            <Arguments possibleAnswerId={answerResult.id} answerArguments={answerResult.arguments} />
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    </div>
}