import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useJoinCode} from "../../components/CodeJoinForm";
import {useEffect, useState} from "react";
import {CODE_LENGTH} from "../../lib/constants";

export default function DirectJoin() {

    const {data: session} = useSession({required: false})
    const userLoggedIn = !!session?.user

    const router = useRouter();
    const {joinCode} = router.query;

    const [codeError, setCodeError] = useState('')

    useEffect(() => {
        async function join() {
            await useJoinCode(joinCode, setCodeError, router)
        }
        if (userLoggedIn) {
            // Should add invitation to existing user. Disabled for now. See CodeJoinForm.tsx
            setCodeError("Please sign out before using this code")
        } else if (!joinCode || joinCode.length !== CODE_LENGTH) {
            setCodeError("Invalid code")
        } else {
            join()  // Careful of race conditions -> useEffect should not use async functions
        }
    }, [userLoggedIn, joinCode]);

    return <div className="main-container">
        {codeError && <h1>{codeError}</h1>}
    </div>
}