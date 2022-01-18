import {useBiotope} from "../../../components/util/hooks"
import {useRouter} from 'next/router'
import {useState} from 'react'
import {fetcher} from "../../../components/util/fetcher";

export const INVITE_CODE_EXPIRATIONS = [
    { name: 'exp_14d', value: 14, label: '2 weeks'},
    { name: 'exp_1m', value: 30,label: '1 month', default: true},
    { name: 'exp_3m', value: 91,label: '3 months'},
]

export default function BiotopeInvite() {

    const inviteEmail = async (event) => {
        event.preventDefault()
        const res = await fetcher(`/api/b/${name}/invite`, {
            email: event.target.email.value,
        })
        // TODO: Handle errors
        console.log('Result from Invite API', res)
    }

    const inviteCode = async (event) => {
        event.preventDefault()
        const res = await fetcher(`/api/b/${name}/createCode`, {
            code: customCode,
            expiration: event.target.codeExpiration.value,
        })
        // TODO: Handle errors
        console.log('Result from CreateCode API', res)
    }

    const {name} = useRouter().query
    const {biotope: b} = useBiotope(name as string)

    const [invitedEmail, setInvitedEmail] = useState("");
    const [customCode, setCustomCode] = useState("");
    const [codeExpiration, setCodeExpiration] = useState(30);

    return b ? <>
        Invite your friend to {b.name}:
        <form onSubmit={inviteEmail}>
            <label htmlFor="email">Email to invite:</label>
            <input id="email" type="email" autoComplete="email" required
                   value={invitedEmail} onChange={e => setInvitedEmail(e.target.value)}/>
            <button type="submit">Invite</button>
        </form>
        <hr />
        Create invitation code:
        <form onSubmit={inviteCode}>
            <label htmlFor="code">Enter custom invitation code: (6 characters)</label>
            <input id="code" type="text" required placeholder="XYZ123"
                   value={customCode} onChange={e => setCustomCode(e.target.value)}/>

            <div>Code will be valid for:</div>
            { INVITE_CODE_EXPIRATIONS.map((expiration) =>
                <div className="form-check" key={expiration.name}>
                    <input className="form-check-input" type="radio" name="codeExpiration"
                           value={expiration.value} id={expiration.name} checked={codeExpiration === expiration.value}
                           onChange={() => setCodeExpiration(expiration.value)} />
                    <label className="form-check-label" htmlFor={expiration.name}>
                        {expiration.label}
                    </label>
                </div>)
            }

            <button type="submit">Create code</button>
        </form>
    </> : null;
}