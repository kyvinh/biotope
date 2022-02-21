import React, {useState} from "react";
import {fetcher} from "./util/fetcher";
import {getSession} from "next-auth/react";
import messages from "../lib/messages.fr";

export const EmailJoinForm = () => {

    const [codeError, setCodeError] = useState('')
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
                await getSession()  // Updates the email shown to user
            }
        }
    }

    return <div className="alert alert-info justify-content-center" role="alert">
        {messages.invitation["email-join-info"]}:
        <form className="row row-cols-sm-auto mt-1 g-2 align-items-center justify-content-center" onSubmit={onCodeSubmit}>
            {!success && <>
                <div className="col-12">
                    <input name="email" id="email" type="email" required
                           className={`form-control ${codeError ? 'is-invalid' : ''}`}/>
                    {error && <div className="alert-danger">{error}</div>}
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">{messages.invitation["code-join-action"]}</button>
                </div>
            </>
            }
            {success && <div className="col-12 lead">{messages.invitation["email-join-success"]}</div> }
        </form>
    </div>

}