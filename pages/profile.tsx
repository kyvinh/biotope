import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Profile() {
    const { data: session, status: loading } = useSession({ required: false })

    // When rendering client side don't display anything until loading is complete
    // From next-auth-example/protected.js
    if (typeof window !== 'undefined' && loading) return null
    if (!session) {
        return <div>NO ACCESS <p>Go to <Link href="/faq/pseudonimity">FAQ</Link></p></div>
    }

    return (
        <>
            <h1>Your Profile</h1>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </>
    )
}

