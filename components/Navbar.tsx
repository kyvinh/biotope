import {signOut, useSession} from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
    const {data: session} = useSession({required: false}) // Should add serverSideProps so session is loaded on server?

    return (
        <div className="container-fluid">
            <header className="header-area bg-white shadow-sm">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-2">
                            <div className="logo-box">
                                <a href="index.html" className="logo"><img src="/images/logo.png" alt="logo" height="33" /></a>
                                <div className="user-action">
                                    <div className="search-menu-toggle icon-element icon-element-xs shadow-sm mr-1"
                                         data-toggle="tooltip" data-placement="top" title="Search">
                                        <i className="la la-search"></i>
                                    </div>
                                    <div className="off-canvas-menu-toggle icon-element icon-element-xs shadow-sm"
                                         data-toggle="tooltip" data-placement="top" title="Main menu">
                                        <i className="la la-bars"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-10">
                            <div className="menu-wrapper border-left border-left-gray pl-4 justify-content-end">
                                <nav className="menu-bar mr-auto menu--bar">
                                    <ul>
                                        <li>
                                            <a href="#">Home <i className="la la-angle-down fs-11"></i></a>
                                            <ul className="dropdown-menu-item">
                                                <li><a href="index.html">Home - landing</a></li>
                                                <li><a href="home-2.html">Home - main</a></li>
                                                <li><a href="home-3.html">Home - layout 2 <span
                                                    className="badge bg-warning text-white">New</span></a></li>
                                            </ul>
                                        </li>
                                        <li className="is-mega-menu">
                                            <a href="#">pages <i className="la la-angle-down fs-11"></i></a>
                                            <div className="dropdown-menu-item mega-menu">
                                                <ul className="row">
                                                    <li className="col-lg-3">
                                                        <a href="user-profile.html">user profile</a>
                                                        <a href="notifications.html">Notifications</a>
                                                        <a href="referrals.html">Referrals</a>
                                                        <a href="setting.html">settings</a>
                                                        <a href="ask-question.html">ask question</a>
                                                        <a href="question-details.html">question details</a>
                                                        <a href="about.html">about</a>
                                                        <a href="revisions.html">revisions</a>
                                                        <a href="category.html">category</a>
                                                        <a href="companies.html">companies</a>
                                                        <a href="company-details.html">company details</a>
                                                    </li>
                                                    <li className="col-lg-3">
                                                        <a href="careers.html">careers</a>
                                                        <a href="career-details.html">career details</a>
                                                        <a href="contact.html">contact</a>
                                                        <a href="faq.html">FAQs</a>
                                                        <a href="pricing-table.html">pricing tables</a>
                                                        <a href="error.html">page 404</a>
                                                        <a href="terms-and-conditions.html">Terms & conditions</a>
                                                        <a href="privacy-policy.html">privacy policy</a>
                                                        <a href="cart.html">cart</a>
                                                        <a href="talent.html">talent</a>
                                                        <a href="advertising.html">advertising</a>
                                                    </li>
                                                    <li className="col-lg-3">
                                                        <a href="free-demo.html">free demo</a>
                                                        <a href="checkout.html">checkout</a>
                                                        <a href="wishlist.html">wishlist</a>
                                                        <a href="login.html">login</a>
                                                        <a href="login-2.html">login 2</a>
                                                        <a href="signup.html">sign up</a>
                                                        <a href="signup-2.html">sign up 2</a>
                                                        <a href="recover-password.html">recover password</a>
                                                        <a href="questions-layout-2.html">questions layout 2 <span
                                                            className="badge bg-warning text-white">New</span></a>
                                                        <a href="questions-full-width.html">questions full-width <span
                                                            className="badge bg-warning text-white">New</span></a>
                                                        <a href="questions-left-sidebar.html">questions left
                                                            sidebar <span
                                                                className="badge bg-warning text-white">New</span></a>
                                                    </li>
                                                    <li className="col-lg-3">
                                                        <a href="questions-right-sidebar.html">questions right
                                                            sidebar <span
                                                                className="badge bg-warning text-white">New</span></a>
                                                        <a href="user-list.html">user list <span
                                                            className="badge bg-warning text-white">New</span></a>
                                                        <a href="category-list.html">category list <span
                                                            className="badge bg-warning text-white">New</span></a>
                                                        <a href="tags-list.html">tags list <span
                                                            className="badge bg-warning text-white">New</span></a>
                                                        <a href="add-post.html">add post <span
                                                            className="badge bg-warning text-white">New</span></a>
                                                        <a href="badges-list.html">Badges list <span
                                                            className="badge bg-warning text-white">New</span></a>
                                                        <a href="job-list.html">job list <span
                                                            className="badge bg-warning text-white">New</span></a>
                                                        <a href="error-2.html">page 404 2 <span
                                                            className="badge bg-warning text-white">New</span></a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li>
                                            <a href="#">blog <i className="la la-angle-down fs-11"></i></a>
                                            <ul className="dropdown-menu-item">
                                                <li><a href="blog-grid-no-sidebar.html">grid no sidebar</a></li>
                                                <li><a href="blog-left-sidebar.html">blog left sidebar</a></li>
                                                <li><a href="blog-right-sidebar.html">blog right sidebar</a></li>
                                                <li><a href="blog-single.html">blog detail</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                                <form method="post" className="mr-2">
                                    <div className="form-group mb-0">
                                        <input className="form-control form--control h-auto py-2" type="text"
                                               name="search" placeholder="Type your search words..." />
                                            <button className="form-btn" type="button"><i className="la la-search"></i>
                                            </button>
                                    </div>
                                </form>
                                <div className="nav-right-button">
                                    <a href="login.html" className="btn theme-btn theme-btn-sm theme-btn-outline mr-1">Log
                                        in</a>
                                    <a href="signup.html" className="btn theme-btn theme-btn-sm">Sign up</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="off-canvas-menu custom-scrollbar-styled">
                    <div className="off-canvas-menu-close icon-element icon-element-sm shadow-sm" data-toggle="tooltip"
                         data-placement="left" title="Close menu">
                        <i className="la la-times"></i>
                    </div>
                    <ul className="generic-list-item off-canvas-menu-list pt-90px">
                        <li>
                            <a href="#">Home</a>
                            <ul className="sub-menu">
                                <li><a href="index.html">Home - landing</a></li>
                                <li><a href="home-2.html">Home - main</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="#">Pages</a>
                            <ul className="sub-menu">
                                <li><a href="user-profile.html">user profile</a></li>
                                <li><a href="notifications.html">Notifications</a></li>
                                <li><a href="referrals.html">Referrals</a></li>
                                <li><a href="setting.html">settings</a></li>
                                <li><a href="ask-question.html">ask question</a></li>
                                <li><a href="question-details.html">question details</a></li>
                                <li><a href="about.html">about</a></li>
                                <li><a href="revisions.html">revisions</a></li>
                                <li><a href="category.html">category</a></li>
                                <li><a href="companies.html">companies</a></li>
                                <li><a href="company-details.html">company details</a></li>
                                <li><a href="careers.html">careers</a></li>
                                <li><a href="career-details.html">career details</a></li>
                                <li><a href="contact.html">contact</a></li>
                                <li><a href="faq.html">FAQs</a></li>
                                <li><a href="pricing-table.html">pricing tables</a></li>
                                <li><a href="error.html">page 404</a></li>
                                <li><a href="terms-and-conditions.html">Terms & conditions</a></li>
                                <li><a href="privacy-policy.html">privacy policy</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="#">blog</a>
                            <ul className="sub-menu">
                                <li><a href="blog-grid-no-sidebar.html">grid no sidebar</a></li>
                                <li><a href="blog-left-sidebar.html">blog left sidebar</a></li>
                                <li><a href="blog-right-sidebar.html">blog right sidebar</a></li>
                                <li><a href="blog-single.html">blog detail</a></li>
                            </ul>
                        </li>
                    </ul>
                    <div className="off-canvas-btn-box px-4 pt-5 text-center">
                        <a href="#" className="btn theme-btn theme-btn-sm theme-btn-outline" data-toggle="modal"
                           data-target="#loginModal"><i className="la la-sign-in mr-1"></i> Login</a>
                        <span className="fs-15 fw-medium d-inline-block mx-2">Or</span>
                        <a href="#" className="btn theme-btn theme-btn-sm" data-toggle="modal"
                           data-target="#signUpModal"><i className="la la-plus mr-1"></i> Sign up</a>
                    </div>
                </div>
                <div className="mobile-search-form">
                    <div className="d-flex align-items-center">
                        <form method="post" className="flex-grow-1 mr-3">
                            <div className="form-group mb-0">
                                <input className="form-control form--control pl-40px" type="text" name="search"
                                       placeholder="Type your search words..." />
                                    <span className="la la-search input-icon"></span>
                            </div>
                        </form>
                        <div className="search-bar-close icon-element icon-element-sm shadow-sm">
                            <i className="la la-times"></i>
                        </div>
                    </div>
                </div>
                <div className="body-overlay"></div>
            </header>            <header
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
                        <div><Link href="/user/profile"><span>{session.user.name ? session.user.name : session.user.email}</span></Link></div>
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