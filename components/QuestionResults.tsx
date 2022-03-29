import React, {useState} from "react";
import {ProgressBar} from "react-bootstrap";
import {Arguments} from "./Arguments";
import messages from "../lib/messages.fr";
import {PossibleAnswerWithArguments, PossibleAnswerWithArgumentsAndCount} from "../lib/constants";
import {fetcher} from "./util/fetcher";

export const computeResults = (possibleAnswers: PossibleAnswerWithArguments[], rawResults) => {
    const totalVotesCount: number = rawResults.reduce((acc, result) => acc + result._count.answers, 0)
    const maxVotersCount: number = rawResults.reduce((acc, rawResult) => rawResult.votersCount > acc ? rawResult.votersCount : acc, 0);
    const resultsWithCount: PossibleAnswerWithArgumentsAndCount[] = rawResults.reduce(
        (acc, rawResult) => {
            const possibleAnswer: PossibleAnswerWithArguments = possibleAnswers.find(element => element.id === rawResult.id)
            const answerResult:PossibleAnswerWithArgumentsAndCount = {
                count: rawResult._count.answers,
                percent: Number((rawResult._count.answers / rawResult.votersCount * 100).toFixed(0)),
                incomplete: rawResult.votersCount <= 3 || rawResult.votersCount < maxVotersCount / 5,
                sameUserVotes: rawResult.sameUserVotes,
                votersCount: rawResult.votersCount,
                ...possibleAnswer
            }
            return [...acc, answerResult]
        }
        , [])
    return {
        totalVotesCount, resultsWithCount, maxVotersCount
    }
}

export const QuestionResults = ({question, results: rawResults, onArgumentUpdated, showDebug = false}) => {
    if (!rawResults) {
        return null
    }

    const argumentsCount = question.possibleAnswers.reduce((acc, answer) => acc + answer.arguments.length, 0)
    const {totalVotesCount, resultsWithCount: answersWithCount, maxVotersCount} = computeResults(question.possibleAnswers, rawResults)
    answersWithCount.sort((n1, n2) => n1.incomplete ? 1 : n2.percent - n1.percent)

    const [showDetails, setShowDetails] = useState(false)

    const onArgumentAdded = (possibleAnswerId, argument) => {
        const possibleAnswer = question.possibleAnswers.find(element => element.id === possibleAnswerId)
        possibleAnswer.arguments.push(argument)
        onArgumentUpdated()
    }

    const combine = async (event, sourceAnswer, targetAnswer) => {
        event.preventDefault()
        const res = await fetcher(`/api/pa/${sourceAnswer}/combine`, {
            sourcePossibleAnswer: sourceAnswer,
            targetPossibleAnswer: targetAnswer
        });
        if (res?.status == 'ok') {
            console.log(res)
        }
    }

    return <>
        <div className="subheader results-subheader">
            <div className="subheader-title">
                <div className="d-flex align-items-center justify-content-between">
                    <h3 className="fs-16">{messages.results.header}: {maxVotersCount} {maxVotersCount > 1 ? messages.results.respondents : messages.results.respondent} ({totalVotesCount} {totalVotesCount > 1 ? messages.results.votes : messages.results.vote})</h3>
                    <a className="btn btn-outline-secondary" onClick={() => setShowDetails(!showDetails)}>{showDetails ? messages.results["details-hide"] : messages.results["details-show"]}</a>
                </div>
            </div>
        </div>
        <div className="container-fluid mt-3 ps-0 pe-0">
            {showDetails &&
                <div className="text-end"><small>{messages.results["details-legend"]}</small></div>
            }
            {answersWithCount.map(answerResult => {
                return <div className="row mb-2">
                    <div className="col-5">
                        <h5 className="text-end border-bottom border-bottom-gray">{answerResult.possibleText ? answerResult.possibleText : answerResult.possibleNumber}</h5>
                    </div>
                    <div className="col d-flex align-items-center">
                        {answerResult.incomplete ?
                            <ProgressBar className="flex-fill progress-incomplete" variant={`none`} now={100} label={messages.results.incomplete}/>
                            :
                            <ProgressBar className="flex-fill" variant={`${answerResult.order + 1}`} now={answerResult.percent} label={`${answerResult.percent}%`}/>
                        }
                    </div>
                    {showDetails &&
                        <div className="col-1 d-flex align-items-center">
                            <small>{answerResult.count} / {answerResult.votersCount}</small>
                        </div>
                    }
                </div>
            })}
        </div>

        {argumentsCount > 0 && <>
            <div className="subheader results-subheader mt-4">
                <div className="subheader-title">
                    <h3 className="fs-16">{messages.arguments["arguments-list-header"]}:</h3>
                </div>
            </div>
            <div className="container-fluid mt-3">
                {answersWithCount.map(answerResult => {
                    if (answerResult.arguments.length === 0) {
                        return null
                    }
                    return <div className="row mb-4 mt-3">
                        <h5 className="text-center">{answerResult.possibleText ? answerResult.possibleText : answerResult.possibleNumber}</h5>
                        <Arguments possibleAnswerId={answerResult.id} answerArguments={answerResult.arguments} />
                    </div>
                })}
            </div>
        </>}

        {showDebug && answersWithCount.map(answerResult => {
            const [showMergeAnswer, setShowMergeAnswer] = useState(false)
            const combinations = answerResult.sameUserVotes.reduce((acc, votes) => {
                const otherAnswer = answersWithCount.find(pa => pa.id === votes.possibleAnswerId)
                return [...acc, { ...otherAnswer, ...votes}]
            }, [])
            return <div className="answer-wrap d-flex mt-5" key={`results-${answerResult.id}`}>
                        <div className="votes votes-styled w-auto">
                            <div id="vote2" className="upvotejs text-center">
                                <span className="count">{answerResult.count}<br /> {answerResult.count > 1 ? messages.results.votes : messages.results.vote}</span>
                            </div>
                            <div id="vote2" className="upvotejs text-center mt-2">
                                <span className="count">{answerResult.votersCount}<br /> {answerResult.votersCount > 1 ? messages.results.respondents : messages.results.respondent}</span>
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
                                                            <a className="btn btn-outline-primary ms-2" onClick={e => combine(e, answerResult.id, combination.possibleAnswerId)}>{messages.results["answer-merge"]}</a>
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