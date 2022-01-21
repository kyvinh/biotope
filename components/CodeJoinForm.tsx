import React, {useState} from "react";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {fetcher} from "./util/fetcher";

export const CodeJoinForm = () => {

    const router = useRouter()
    const {data: session} = useSession({required: false})
    const [codeError, setCodeError] = useState('')

    const userLoggedIn = !!session?.user

    const onCodeSubmit = async (event) => {
        event.preventDefault()
        const code = event.target.invitationCode.value

        if (userLoggedIn) {
            // Add an invitation to an existing user
            // Disabled for now
        } else {
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
    }

    return <div className={`${userLoggedIn ? 'd-none': ''}`}>
        <form onSubmit={onCodeSubmit}>
            <div className="form-group">
                <label htmlFor="invitationCode">Please enter your invitation code here:</label>
                <input name="invitationCode" id="invitationCode" required className={`form-control ${codeError ? 'is-invalid' : ''}`}/>
                <div className="invalid-feedback">{codeError}</div>
                <button type="submit" className="btn btn-primary">Join</button>
            </div>
        </form>
    </div>;
}