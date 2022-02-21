import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import messages from "../lib/messages.fr";

export default function Navbar() {
    const {data: session} = useSession({required: false}) // Should add serverSideProps so session is loaded on server?

    return (
        <header className="header-area bg-white shadow-sm">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-12">
                        <div className="logo-box">
                            <div>
                                <Link href="/">
                                    <a className="logo"><img src="/images/logo.png" alt="logo" height="35"/>
                                    </a>
                                </Link>

                            </div>
                            <div className="user-action">
                                {session ?
                                    <>
                                        <Link href="/user/profile">
                                            <a className="fs-6"><i className="la la-user"/>
                                                {session.user.name ? session.user.name : session.user.email}</a>
                                        </Link>
                                        {!session.user.isAnon &&
                                            <button type="button" onClick={() => signOut({callbackUrl: '/'})}
                                                    className="btn btn-sm btn-outline-dark ms-2"
                                            >{messages.user["signout-action"]} <i className="la la-sign-out"/></button>
                                        }
                                    </>
                                    :
                                    <Link href="/api/auth/signin" locale={false}>
                                        <a className="btn btn-outline-primary"><i
                                            className="la la-sign-in mr-1"/> {messages.user["signin-action"]}</a>
                                    </Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}