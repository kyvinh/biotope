import React, {useState} from "react";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {fetcher} from "./util/fetcher";
import Router, {BaseRouter} from "next/dist/shared/lib/router/router";
import messages from "../lib/messages.fr";

export async function useJoinCode(code, setCodeError: (value: (((prevState: string) => string) | string)) => void, router: BaseRouter & Pick<Router, "push">) {
    // Create user and invitation
    const joinRequest = await signIn("code-credentials", {
        redirect: false,
        code: code,
    });
    if (joinRequest.ok) {
        if (joinRequest.error) {
            setCodeError(joinRequest.error);
        } else {
            setCodeError(null)
            // Find the concerned biotope in the invitation and redirect/guide user
            const res = await fetcher(`/api/user/memberships?first=true`);
            // TODO Should have some loading animation
            await router.push(res.redirect)
        }
    } else {
        console.log('join code fatal error:', joinRequest)
    }
}

export const CodeJoinForm = () => {

    const router = useRouter()
    const {data: session} = useSession({required: false})
    const [codeError, setCodeError] = useState('')
    const [loading, setLoading] = useState(false)

    const userLoggedIn = !!session?.user

    const onCodeSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        const code = event.target.invitationCode.value

        if (userLoggedIn) {
            // Add an invitation to an existing user
            // Disabled for now
        } else {
            await useJoinCode(code, setCodeError, router);
            setLoading(false)
        }
    }

    return <>
        {(!userLoggedIn && !loading) &&
        <form className="row row-cols-1 g-3 align-items-center mb-4" onSubmit={onCodeSubmit}>

            <div className="col">
                <label htmlFor="invitationCode">{messages.invitation["code-join-label"]}</label>
            </div>
            <div className="col d-flex align-items-center justify-content-center">
                <div>
                    <input name="invitationCode" id="invitationCode" required
                           className={`form-control ${codeError ? 'is-invalid' : ''}`}/>
                    <div className="invalid-feedback">{codeError}</div>
                </div>
                <button type="submit" className="btn btn-primary ms-2">{messages.invitation["code-join-action"]}</button>
            </div>
        </form>
        }
        {loading &&
            <div className="spinner-border text-info w-auto mb-4" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        }
    </>
}