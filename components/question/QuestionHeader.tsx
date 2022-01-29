import Link from "next/link";
import React from "react";

export const QuestionHeader = ({biotope : b}) => {

    return <section className="hero-area bg-white shadow-sm overflow-hidden pt-4 pb-3">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-12">
                    <div className="hero-content">
                        <h2 className="section-title pb-2 fs-24 lh-34"><Link href={`/b/${b.name}`}>{b.name}</Link>
                        </h2>
                        <p className="lh-26">{b.description}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
}