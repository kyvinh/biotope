import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useJoinCode} from "../../components/CodeJoinForm";
import {useEffect, useState} from "react";
import {CODE_LENGTH} from "../../lib/constants";
import messages from "../../lib/messages.fr";

export default function DirectJoin() {

    const {data: session, status} = useSession({required: false})
    const userLoggedIn = !!session?.user

    const router = useRouter();
    const {joinCode} = router.query;

    const [codeError, setCodeError] = useState('')

    useEffect(() => {
        async function join() {
            await useJoinCode(joinCode, setCodeError, router)
        }
        if (status === 'loading') {
            // Waiting for session to be fetched before deciding
        } else if (userLoggedIn) {
            // Should add invitation to existing user. Disabled for now. See CodeJoinForm.tsx
            // setCodeError("Please sign out before using this code")
            router.push('/user/profile')
        } else if (!joinCode || joinCode.length !== CODE_LENGTH) {
            setCodeError(messages.invitation["code-join-invalid"])
        } else {
            join()  // Careful of race conditions -> useEffect should not use async functions
        }
    }, [status, userLoggedIn, joinCode]);

    return <div className="main-container">
        {codeError && <h1>{codeError}</h1>}
    </div>
}