import Navbar from './Navbar'
import messages from "../lib/messages.fr";

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
                                <p className="copyright-desc fs-12"><a href="mailto:info@biotope.brussels">Biotope</a>: {messages.general["short-slug"]}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </>
}