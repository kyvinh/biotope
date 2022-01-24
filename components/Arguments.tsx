import React, {useState} from "react";
import {fetcher} from "./util/fetcher";
import {useSession} from "next-auth/react";
import {UserFlair} from "./UserFlair";
import {useForm} from "react-hook-form";
import {NewArgumentInput} from "../pages/api/pa/[pa]/argument";

export const Arguments = ({answerArguments, possibleAnswerId, onArgumentAdded}) => {

    const {data: session} = useSession({required: false})
    const [showAddArgument, setShowAddArgument] = useState(false)

    // New argument form
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onAddArgument = async (newArgument:NewArgumentInput) => {
        if (!session) {
            // Arguments are anonymous but you should be logged in? (SO lets you add as anonymous but has a review queue in process)
            throw new Error("Currently need to be signed in to argument, even anonymously!")
        }
        const res = await fetcher(`/api/pa/${possibleAnswerId}/argument`, newArgument);
        if (res?.status == 'ok') {
            setShowAddArgument(false)
            reset()
            onArgumentAdded(possibleAnswerId, res.argument)
        }
    };

    // console.log(questionArguments)

    return <>
        { answerArguments && answerArguments.map((argument) =>
            <div key={argument.id}>
                <p>{argument.anonymous ?
                    <UserFlair user={{
                        name: "Anonymous",
                        reputationsPoints: 0,
                    }} />
                    :
                    <UserFlair user={argument.creator} />
                }
                : {argument.text}</p>
            </div>
        )}
        { showAddArgument ?
            <form onSubmit={handleSubmit(onAddArgument)} className="argument-add">
                <div className="form-group">
                    <label htmlFor={`argument-${possibleAnswerId}-text`}>Your argument</label>
                    <div className="form-text">Please add a convincing argument or a factual observation that leads to this vote.</div>
                    <textarea className="form-control" id={`argument-${possibleAnswerId}-text`}
                              rows={3} {...register("argumentText", {required: true})} />
                    {errors.argumentText && <div className="invalid-feedback">A text is required.</div>}
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" defaultChecked={true}
                           {...register("argumentAnonymous")} id={`argument-${possibleAnswerId}-anonymous`} />
                    <label className="form-check-label" htmlFor={`argument-${possibleAnswerId}-anonymous`}>
                        Post anonymously (your name will not be displayed and encrypted)
                    </label>
                </div>
                <input type="submit" value="Submit argument" className="btn btn-primary" />
                <button className="btn btn-link" onClick={() => setShowAddArgument(false)}>Cancel</button>
            </form>
        :
            <button className="btn btn-link" onClick={() => setShowAddArgument(true)}>Add an argument/observation</button>
        }
    </>
}