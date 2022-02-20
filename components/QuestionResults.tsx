import React from "react";
import {ProgressBar} from "react-bootstrap";
import {Arguments} from "./Arguments";
import {Argument, PossibleAnswer} from ".prisma/client";

export type PossibleAnswerWithArguments = PossibleAnswer & { arguments: Argument[]}
export type PossibleAnswerWithCount = PossibleAnswerWithArguments & { count: number; percent: number, arguments: Argument[]}

export const computeResults = (possibleAnswers: PossibleAnswerWithArguments[], rawResults) => {
    const totalVotesCount: number = rawResults.reduce((acc, result) => acc + result._count.answers, 0)
    const resultsWithCount: PossibleAnswerWithCount[] = rawResults.reduce(
        (acc, rawResult) => {
            const possibleAnswer: PossibleAnswerWithArguments = possibleAnswers.find(element => element.id === rawResult.id)
            const answerResult:PossibleAnswerWithCount = {count: 0, percent: undefined, ...possibleAnswer}
            answerResult.count = rawResult._count.answers
            answerResult.percent = answerResult.count / totalVotesCount * 100
            return [...acc, answerResult]
        }
        , [])
    return {
        totalVotesCount, resultsWithCount
    }
}

export const QuestionResults = ({question, results: rawResults, onArgumentUpdated}) => {
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

    const {totalVotesCount, resultsWithCount: answersWithCount} = computeResults(question.possibleAnswers, rawResults)
    answersWithCount.sort((n1, n2) => n2.count - n1.count)

    const onArgumentAdded = (possibleAnswerId, argument) => {
        const possibleAnswer = question.possibleAnswers.find(element => element.id === possibleAnswerId)
        possibleAnswer.arguments.push(argument)
        onArgumentUpdated()
    }

    return <>
        <div className="subheader">
            <div className="subheader-title">
                <h3 className="fs-16">Results: {totalVotesCount} {totalVotesCount > 1 ? "votes" : "vote"}</h3>
            </div>
        </div>
        {answersWithCount.map(answerResult =>
            <div className="answer-wrap d-flex" key={answerResult.id}>
                <div className="votes votes-styled w-auto">
                    <div id="vote2" className="upvotejs text-center">
                        <span className="count">{answerResult.count}<br /> {answerResult.count > 1 ? "votes" : "vote"}</span>
                    </div>
                </div>
                <div key={answerResult.id} className="answer-body-wrap flex-grow-1">
                    <ProgressBar variant={`${answerResult.order + 1}`} now={answerResult.percent} label={`${answerResult.percent}%`} />
                    <div className="answer-post-progress-wrap">
                        <div className="answer-body">
                            <h3>{answerResult.possibleText ? answerResult.possibleText : answerResult.possibleNumber}</h3>
                        </div>
                        <div className="comments-wrap">
                            <Arguments possibleAnswerId={answerResult.id} answerArguments={answerResult.arguments}
                                       onArgumentAdded={onArgumentAdded}/>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
}