import Layout from '../components/Layout'
import { useSession } from 'next-auth/client'
import Link from 'next/link'

// Export the `session` prop to use sessions with Server Side Rendering
// export async function getServerSideProps(context) {
//     return {
//         props: {
//             session: await getSession(context)
//         }
//     }
// }

export default function Profile() {
    const [session, loading ] = useSession()

    // When rendering client side don't display anything until loading is complete
    // From next-auth-example/protected.js
    if (typeof window !== 'undefined' && loading) return null
    if (!session) {
        return <div>NO ACCESS <p>Go to <Link href="/faq/pseudonimity">FAQ</Link></p></div>
    }

    return (
        <Layout>
            <h1>Your Profile</h1>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </Layout>
    )
}

