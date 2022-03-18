import messages from "../../lib/messages.fr";
import {formatDistance} from "../util/dates";
import Link from "next/link";
import React from "react";
import {Cercle} from ".prisma/client";
import {QuestionWithMetadata} from "../../lib/constants";

export const QuestionListItem = ({question, b}: {question: QuestionWithMetadata, b: Cercle}) => {

    const maxShortDescriptionLength = 200;
    question.shortDescription = question.description.substring(0, maxShortDescriptionLength) + (question.description.length > maxShortDescriptionLength ? '…' : '');

    return <div className="media d-flex align-items-start media-card rounded-0 shadow-none my-3 bg-transparent p-2 border-bottom border-bottom-gray">
        <div className="votes text-center flex-fill">
            <div className="vote-block">
                <span className="vote-counts d-block text-center lh-20 fw-medium">{question.votes}</span>
                <span className="vote-text d-block fs-13 lh-18">{question.votes > 1 ? messages.results.respondents : messages.results.respondent}</span>
            </div>
            {question.userAnswered &&
                <div className="vote-block">
                    <span className="vote-counts d-block text-center text-color-3 mt-3 fs-30 fw-medium"><i className="las la-vote-yea"/></span>
                    <span className="vote-text d-block fs-13 lh-18 text-nowrap">{messages.question.answered}</span>
                </div>
            }
            {question.closed &&
                <div className={`answer-block ${question.closed ? 'closed' : 'answered'} my-2`}>
                    <span className="answer-text d-block fs-13 lh-18">{messages.question.closed}</span>
                    <span className="answer-counts d-block lh-20 fw-medium">{formatDistance(question.closingDate)}</span>
                </div>
            }
        </div>
        <div className="media-body d-flex w-100 flex-column flex-fill">
            <h5 className="mb-2 fw-medium">
                <Link href={`/b/${b.name}/q/${question.id}`}><a>{question.name}</a></Link>
            </h5>

            <Link href={`/b/${b.name}/q/${question.id}`}>
                <div className="mb-2 lh-20 fs-15 link-pointer">{question.shortDescription}</div>
            </Link>

            <div className="question-meta-list-item">
                <div className="tags">
                    {question.tags.map((tag) =>
                        <span key={tag.id} className="tag-link">{tag.name}</span>)}
                </div>
                <div className="meta-dates">
                    {!question.closed && question.lastVoteDate &&
                        <small>
                            <span className="meta-label">{messages.question["last-vote"]}</span>
                            <span className="meta-value">{formatDistance(question.lastVoteDate)}</span>
                        </small>
                    }
                    <small>
                        <span className="meta-label">{messages.question["asked-since"]}</span>
                        <span className="meta-value">{formatDistance(question.createdOn)}</span>
                    </small>
                    {!question.closed && question.closingDate && <small>
                        <span className="meta-label">{messages.question["closes-in"]}</span>
                        <span className={`meta-value ${!question.userAnswered ? 'meta-red' : ''}`}>{formatDistance(question.closingDate)}</span>
                    </small>
                    }
                </div>
            </div>
        </div>
    </div>

}