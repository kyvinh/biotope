import React, {useState} from "react";
import {fetcher} from "./util/fetcher";
import {useSession} from "next-auth/react";
import {UserFlair} from "./UserFlair";
import {useForm} from "react-hook-form";
import {NewArgumentInput} from "../pages/api/q/[q]/argument";

export const Arguments = ({answerArguments, possibleAnswerId, onArgumentAdded}) => {

    const {data: session} = useSession({required: false})
    const [showAddArgument, setShowAddArgument] = useState(false)

    // New argument form
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onAddArgument = async (newArgument:NewArgumentInput) => {
        if (!session) {
            // Arguments are anonymous but you should be logged in? (SO lets you add as anonymous but has a review queue in process)
            throw new Error("Currently no anonymous argument allowed!")
        }
        const res = await fetcher(`/api/q/${possibleAnswerId}/argument`, newArgument);
        if (res?.status == 'ok') {
            setShowAddArgument(false);
            onArgumentAdded(possibleAnswerId, res.argument)
        }
    };

    // console.log(questionArguments)

    return <>
        { answerArguments ? answerArguments.map((argument) =>
            <div key={argument.id}>
                <p><UserFlair user={argument.creator} />: {argument.text}</p>
            </div>
        ) : null}
        { showAddArgument ?
            <form onSubmit={handleSubmit(onAddArgument)} className="argument-add">
                <div className="form-group">
                    <label htmlFor={`argument-${possibleAnswerId}-text`}>Your argument</label>
                    <div className="form-text">Please add a convincing argument or a factual observation that leads to this vote.</div>
                    <textarea className="form-control" id={`argument-${possibleAnswerId}-text`}
                              rows={3} {...register("argumentText", {required: true})} />
                    {errors.argumentText && <div className="invalid-feedback">A text is required.</div>}
                </div>
                <input type="submit" value="Submit argument" className="btn btn-primary" />
                <button className="btn btn-link" onClick={() => setShowAddArgument(false)}>Cancel</button>
            </form>
        :
            <button className="btn btn-link" onClick={() => setShowAddArgument(true)}>Add an argument/observation</button>
        }
    </>
}