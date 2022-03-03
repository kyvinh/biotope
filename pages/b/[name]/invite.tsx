import {useBiotope} from "../../../components/util/hooks"
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {fetcher} from "../../../components/util/fetcher";
import messages from "../../../lib/messages.fr";
import {QuestionHeader} from "../../../components/question/QuestionHeader";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {whatsappText} from "./index";

export const INVITE_CODE_EXPIRATIONS = [
    { name: 'exp_14d', value: 14, label: messages.invitation["expire-2-weeks"]},
    { name: 'exp_1m', value: 30,label: messages.invitation["expire-1-month"], default: true},
    { name: 'exp_3m', value: 91,label: messages.invitation["expire-3-months"]},
]

export default function BiotopeInvite() {

    const inviteEmail = async (event) => {
        event.preventDefault()
        setSuccessEmail(null)
        setLoading(true)
        const res = await fetcher(`/api/b/${name}/invite`, {
            email: invitedEmail,
            inviterName
        })
        setLoading(false)
        if (res?.status == 'ok') {
            setSuccessEmail(invitedEmail)
            setInvitedEmail("")
        }
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
    const {data: session} = useSession({required: true})
    console.log(session)
    const inviterDefaultName = session?.user?.isAnon ? "" : session?.user?.name

    const [invitedEmail, setInvitedEmail] = useState("");
    const [inviterName, setInviterName] = useState(inviterDefaultName);
    const [customCode, setCustomCode] = useState("");
    const [codeExpiration, setCodeExpiration] = useState(30);
    const [successEmail, setSuccessEmail] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setInviterName(inviterDefaultName)
    }, [inviterDefaultName])

    return b && session? <>
        <QuestionHeader biotope={b} showDescription={false} />

        <section className="question-area">
            <div className="container">
                <div className="card card-item p-3">
                    <h4>{messages.invitation["invite-header-email"]}{b.longName}:</h4>

                    {successEmail &&
                        <div className="alert alert-success mt-4" role="alert">
                            {messages.invitation["invite-success"]} {successEmail}. {messages.invitation["invite-success-cta"]}
                        </div>
                    }

                    <form onSubmit={inviteEmail} className="question-edit card-body p-0 mt-4">

                        <div className="row mb-3">
                            <label htmlFor="email" className="col-4 col-form-label">{messages.invitation["invite-to-label"]}:</label>
                            <div className="col-8">
                                <input id="email" type="email" autoComplete="email" required className="form-control"
                                       value={invitedEmail} onChange={e => setInvitedEmail(e.target.value)}/>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inviterName" className="col-4 col-form-label">{messages.invitation["invite-from-label"]}:</label>
                            <div className="col-8">
                                <input required className="form-control" id="inviterName"
                                       value={inviterName} onChange={e => setInviterName(e.target.value)}/>
                                {(session.user.isAnon || inviterDefaultName === null || inviterDefaultName.length === 0) &&
                                    <div className="form-text">{messages.invitation['inviterName-not-recorded']}</div>
                                }
                            </div>
                        </div>

                        <div className="mt-2">
                            {loading ?
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                :
                                <>
                                    <button className="btn btn-primary me-2"
                                            type="submit">{messages.invitation["invite-action"]} <i className="la la-envelope icon fs-18"/></button>
                                    <Link href={`/b/${b.name}`}><a
                                        className="btn btn-link">{messages.general.cancel}</a></Link>
                                </>
                            }
                        </div>
                    </form>
                </div>

                <div className="card card-item p-3 mt-3">
                    <h4>{messages.invitation["invite-header-whatsapp"]}:</h4>

                    <div className="card-body p-0 mt-3">
                        <Link href={`https://wa.me/?text=${encodeURI(whatsappText)}`}>
                            <a className="btn btn-primary">{messages.invitation["invite-action"]} <i className="la la-whatsapp icon fs-18"/></a>
                        </Link>
                        <Link href={`/b/${b.name}`}><a
                            className="btn btn-link">{messages.general.cancel}</a></Link>
                    </div>
                </div>

            </div>
        </section>

        {/*
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
        */}
    </> : null;
}