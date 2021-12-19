import React, {useState} from "react";
import {fetcher} from "./util/fetcher";
import {useSession} from "next-auth/react";

export const Arguments = ({answerArguments, possibleAnswerId}) => {

    const [showAddArgument, setShowAddArgument] = useState(false)
    const [argumentText, setArgumentText] = useState("")
    const {data: session} = useSession({required: false})

    const submitArgument = async (event) => {
        event.preventDefault();
        event.target.disabled = true;

        if (session) {
            const res = await fetcher(`/api/q/${possibleAnswerId}/argument`, { argumentText});
            if (res?.status == 'ok') {
                // Argument has been recorded
            }
        } else {
            // Arguments are anonymous but you should be logged in? (SO lets you add as anonymous but has a review queue in process)
            throw new Error("Currently no anonymous argument allowed!")
        }
    }

    // console.log(questionArguments)

    return <>
        { answerArguments ? answerArguments.map((argument) =>
            <div key={argument.id}>
                <p>{argument.creator.name}: {argument.text}</p>
            </div>
        ) : null}
        { showAddArgument ?
            <div>
                <textarea value={argumentText} onChange={e => setArgumentText(e.target.value)}/>
                <input type="submit" value="Submit argument" onClick={submitArgument} />
                <button className="btn btn-link" onClick={() => setShowAddArgument(false)}>Cancel</button>
            </div>
        :
            <button className="btn btn-link" onClick={() => setShowAddArgument(true)}>Add an argument/observation</button>
        }
    </>
}