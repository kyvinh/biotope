import {useBiotope} from "../../../components/util/hooks"
import { useRouter } from 'next/router'
import {useState} from 'react'

export default function BiotopeHome() {

    const inviteEmail = async (event) => {
        event.preventDefault()
        const res = await fetch('/api/b/' + name + '/invite', {
            body: JSON.stringify({
                email: event.target.email.value
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })

        const result = await res.json()
        console.log('Result from Invite API', result)
    }

    const { name } = useRouter().query
    const {biotope: b} = useBiotope(name)

    const [invitedEmail, setInvitedEmail] = useState("");

    return b ? <>
        Invite your friend to {b.name} (by {b.creator.name})
        <form onSubmit={inviteEmail}>
            <label htmlFor="email">Email to invite:</label>
            <input id="email" type="email" autoComplete="email" required
                   value={invitedEmail} onChange={e => setInvitedEmail(e.target.value)}/>
            <button type="submit">Invite</button>
        </form>
    </> : null;
}