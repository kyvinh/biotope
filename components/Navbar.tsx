import {signOut, useSession} from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
    const {data: session} = useSession({required: false}) // Should add serverSideProps so session is loaded on server?

    return (
        <div className="container-fluid">
            <header
                className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">

                <a href="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                    <img src="/waterflow-69.png" className="img-fluid" alt="Biotope" />
                </a>

                {
                 /*   <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                        <li><a href="#" className="nav-link px-2 link-secondary">Home</a></li>
                        <li><a href="#" className="nav-link px-2 link-dark">Features</a></li>
                        <li><a href="#" className="nav-link px-2 link-dark">Pricing</a></li>
                        <li><a href="#" className="nav-link px-2 link-dark">FAQs</a></li>
                        <li><a href="#" className="nav-link px-2 link-dark">About</a></li>
                    </ul>*/
                }

                { session ?
                    <div className="d-flex justify-content-between align-items-center col-md-4 text-end">
                        <div><Link href="/profile">{session.user.email}</Link></div>
                        <button type="button" onClick={() => signOut()} className="btn btn-outline-primary">Sign out</button>
                    </div>
                : null }

                { !session ?
                    <div className="col-md-4 text-end">
                        <Link href="/api/auth/signin" locale={false}>
                            <a className="btn btn-outline-primary">Sign in</a>
                        </Link>
                    </div>
                : null }

            </header>
        </div>
    )
}