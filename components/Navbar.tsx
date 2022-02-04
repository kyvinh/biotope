import {signOut, useSession} from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
    const {data: session} = useSession({required: false}) // Should add serverSideProps so session is loaded on server?

    return (
        <header className="header-area bg-white shadow-sm">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-12">
                        <div className="logo-box">
                            <div>
                                <Link href="/">
                                    <a className="logo"><img src="/images/logo.png" alt="logo" height="33"/>
                                        <span className="ms-2 fw-bold" style={{ verticalAlign: "middle"}}>Biotope</span>
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
                                            <button type="button" onClick={() => signOut()}
                                                    className="btn btn-sm btn-outline-dark ms-2"
                                            >Sign out <i className="la la-sign-out"/></button>
                                        }
                                    </>
                                    :
                                    <Link href="/api/auth/signin" locale={false}>
                                        <a className="btn btn-outline-primary"><i
                                            className="la la-sign-in mr-1"/> Sign in</a>
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