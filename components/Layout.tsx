import Navbar from './Navbar'
import messages from "../lib/messages.fr";
import Link from "next/link";

export default function Layout({children}) {
    return <>
            <Navbar/>
            <main>{children}</main>
            <section className="footer-area bg-dark position-relative mt-2">
                <section className="footer-area bg-dark position-relative">
                    <span className="vertical-bar-shape vertical-bar-shape-1"/>
                    <span className="vertical-bar-shape vertical-bar-shape-2"/>
                    <span className="vertical-bar-shape vertical-bar-shape-3"/>
                    <span className="vertical-bar-shape vertical-bar-shape-4"/>
                    <div className="container">
                        <div className="row align-items-center pb-1 copyright-wrap">
                            <div className="col-12">
                                <p className="copyright-desc fs-12">Biotope: {messages.general["short-slug"]}. <Link href="/faq/about">{messages.info["read-more"]}</Link></p>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </>
}