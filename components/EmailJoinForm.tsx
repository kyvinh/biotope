import React, {useState} from "react";
import {fetcher} from "./util/fetcher";
import {useSession} from "next-auth/react";
import messages from "../lib/messages.fr";

export const EmailJoinForm = () => {

    const {data: session} = useSession({required: false})
    const anonUser = !!session?.user.isAnon

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    const onCodeSubmit = async (event) => {
        event.preventDefault()
        const email = event.target.email.value

        const res = await fetcher(`/api/user/saveEmail`, { email });
        if (res?.status == 'ok') {
            if (res.error) {
                setSuccess(false)
                setError(res.error)
            } else {
                setSuccess(true)
                await fetcher(`/api/auth/session?update`)   // Updates the JWT token
                /* This does not work to refresh the session -> https://github.com/nextauthjs/next-auth/issues/596#issuecomment-943453568
                        await getSession()  // Updates the email shown to user
                */
                const event = new Event('visibilitychange');
                document.dispatchEvent(event)
            }
        }
    }

    // Shows nothing when !anonUser && no flash message
    return <>
        {anonUser &&
            <div className="alert alert-info justify-content-center" role="alert">
                {messages.invitation["email-join-info"]}:
                <form className="row row-cols-sm-auto mt-1 g-2 align-items-center justify-content-center" onSubmit={onCodeSubmit}>
                    {!success && <>
                        <div className="col-12">
                            <input name="email" id="email" type="email" required
                                   className={`form-control ${error ? 'is-invalid' : ''}`}/>
                            {error && <div className="alert-danger">{error}</div>}
                        </div>
                        <div className="col-12">
                            <button type="submit" className="btn btn-primary">{messages.invitation["code-join-action"]}</button>
                        </div>
                    </>
                    }
                </form>
                {success && <div className="col-12 lead">{messages.invitation["email-join-success"]}</div> }
            </div>
        }
        {success &&
            <div className="alert alert-info justify-content-center" role="alert">
                {messages.invitation["email-join-info"]}:
                {success && <div className="col-12 lead">{messages.invitation["email-join-success"]}</div> }
            </div>
        }
    </>
}