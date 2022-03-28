import React, {useState} from "react";
import {ProgressBar} from "react-bootstrap";
import {Arguments} from "./Arguments";
import messages from "../lib/messages.fr";
import {PossibleAnswerWithArguments, PossibleAnswerWithArgumentsAndCount} from "../lib/constants";

export const computeResults = (possibleAnswers: PossibleAnswerWithArguments[], rawResults) => {
    const totalVotesCount: number = rawResults.reduce((acc, result) => acc + result._count.answers, 0)
    const resultsWithCount: PossibleAnswerWithArgumentsAndCount[] = rawResults.reduce(
        (acc, rawResult) => {
            const possibleAnswer: PossibleAnswerWithArguments = possibleAnswers.find(element => element.id === rawResult.id)
            const answerResult:PossibleAnswerWithArgumentsAndCount = {count: 0, percent: undefined, sameUserVotes: rawResult.sameUserVotes, votersCount: rawResult.votersCount, ...possibleAnswer}
            answerResult.count = rawResult._count.answers
            answerResult.percent = Number((answerResult.count / answerResult.votersCount * 100).toFixed(0))
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
        <div className="subheader results-subheader">
            <div className="subheader-title">
                <h3 className="fs-16">{messages.results.header}: {totalVotesCount} {totalVotesCount > 1 ? messages.results.votes : messages.results.vote}</h3>
            </div>
        </div>
        {answersWithCount.map(answerResult => {
            const [showMergeAnswer, setShowMergeAnswer] = useState(false)
            const combinations = answerResult.sameUserVotes.reduce((acc, votes) => {
                const otherAnswer = answersWithCount.find(pa => pa.id === votes.possibleAnswerId)
                return [...acc, { ...otherAnswer, ...votes}]
            }, [])
            return <div className="answer-wrap d-flex" key={`results-${answerResult.id}`}>
                        <div className="votes votes-styled w-auto">
                            <div id="vote2" className="upvotejs text-center">
                                <span className="count">{answerResult.count}<br /> {answerResult.count > 1 ? messages.results.votes : messages.results.vote}</span>
                            </div>
                        </div>
                        <div className="answer-body-wrap flex-grow-1">
                            <ProgressBar variant={`${answerResult.order + 1}`} now={answerResult.percent} label={`${answerResult.percent}%`} />
                            <div className="answer-post-progress-wrap">
                                <div className="answer-body">
                                    <h3>{answerResult.possibleText ? answerResult.possibleText : answerResult.possibleNumber}</h3>
                                </div>
                                <div className="comments-wrap">

                                    <Arguments possibleAnswerId={answerResult.id} answerArguments={answerResult.arguments}
                                               onArgumentAdded={onArgumentAdded}/>

                                    {question.closed &&
                                        <div className="comment-form">
                                            {showMergeAnswer ? <>
                                                    Combinaisons possibles:
                                                    <ul>
                                                        {combinations.map(combination => <li key={`combo-${answerResult.id}-${combination.possibleAnswerId}`}>
                                                            {combination.possibleText}: {combination.sameUserVotes} votes en commun ({combination.count} total)
                                                            <Arguments possibleAnswerId={combination.possibleAnswerId} answerArguments={combination.arguments} />
                                                        </li>)}
                                                    </ul>
                                                </>
                                                :
                                                <button className="btn btn-link comment-link"
                                                        onClick={() => setShowMergeAnswer(true)}>{messages.results["answer-merge"]}</button>
                                            }
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>
            </div>}
        )}
    </>
}