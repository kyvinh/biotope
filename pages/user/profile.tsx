import { useSession } from 'next-auth/react'

export default function Profile() {
    const { data: session } = useSession({ required: true })

    return (
        <>
            <h1>Your Profile</h1>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </>
    )
}