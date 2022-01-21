import React, {useState} from "react";
import {signIn, useSession} from "next-auth/react";

export const CodeJoinForm = () => {

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
            const result = await signIn("code-credentials", {
                redirect: false,    // or callbackUrl: '/welcome'
                code: code,
            });
            if (result.ok) {
                if (result.error) {
                    setCodeError(result.error);
                } else {
                    setCodeError(null)
                    // TODO Need to redirect user to biotope with more information... guide new user!
                }
            } else {
                console.log('join code fatal error:', result)
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