import React, {useState} from "react";
import {fetcher} from "./util/fetcher";
import {useSession} from "next-auth/react";
import {UserFlair} from "./UserFlair";
import {useForm} from "react-hook-form";
import {NewArgumentInput} from "../pages/api/pa/[pa]/argument";
import {formatDistance} from "./util/dates";
import messages from "../lib/messages.fr";

export const Arguments = ({answerArguments, possibleAnswerId, onArgumentAdded = null}) => {

    const {data: session} = useSession({required: false})
    const [showAddArgumentForm, setShowAddArgumentForm] = useState(false)
    const formEnabled = !!onArgumentAdded

    // New argument form
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onAddArgument = async (newArgument:NewArgumentInput) => {
        if (!session || !formEnabled) {
            // Arguments are anonymous but you should be logged in? (SO lets you add as anonymous but has a review queue in process)
            throw new Error(messages.arguments["argument-no-user-error"])
        }
        const res = await fetcher(`/api/pa/${possibleAnswerId}/argument`, newArgument);
        if (res?.status == 'ok') {
            setShowAddArgumentForm(false)
            reset()
            onArgumentAdded(possibleAnswerId, res.argument)
        }
    };

    return <>
        <ul className="comments-list">
            { answerArguments && answerArguments.map((argument) =>
                <li key={`comment-${possibleAnswerId}-${argument.id}`}>
                    <div className="comment-body">
                        <span className="comment-copy">{argument.text}</span>
                        <span className="comment-separated">-</span>
                        <span className="comment-date">
                            {argument.anonymous ?
                                <UserFlair user={{
                                    name: messages.user["anonymous-name"],
                                    reputationsPoints: 0,
                                }} theme="none" />
                                :
                                <UserFlair user={argument.creator} theme="none" />
                            },
                        </span>
                        <span className="comment-date"> {formatDistance(argument.createdOn)}</span>
                    </div>
                </li>
            )}
        </ul>

        {formEnabled &&
            <div className="comment-form">
                { showAddArgumentForm ?
                    <form onSubmit={handleSubmit(onAddArgument)} className="argument-add">
                        <div className="form-group">
                            <label className="form-text" htmlFor={`argument-${possibleAnswerId}-text`}>{messages.arguments["add-argument-info"]}</label>
                            <textarea className="form-control" id={`argument-${possibleAnswerId}-text`} maxLength={190}
                                      rows={3} {...register("argumentText", {required: true})} />
                            {errors.argumentText && <div className="invalid-feedback">{messages.arguments["add-argument-required-error"]}</div>}
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" defaultChecked={true} readOnly={true}
                                   {...register("argumentAnonymous")} id={`argument-${possibleAnswerId}-anonymous`} />
                            <label className="form-check-label form-text" htmlFor={`argument-${possibleAnswerId}-anonymous`}>
                                {messages.arguments["post-anonymously-label"]}
                            </label>
                        </div>
                        <input type="submit" value={messages.arguments["add-argument-action"]} className="btn btn-primary" />
                        <button className="btn btn-link" onClick={() => setShowAddArgumentForm(false)}>{messages.general.cancel}</button>
                    </form>
                    :
                    <button className="btn btn-link comment-link" onClick={() => setShowAddArgumentForm(true)}>{messages.arguments["add-argument-form-toggle"]}</button>
                }
            </div>
        }

    </>
}