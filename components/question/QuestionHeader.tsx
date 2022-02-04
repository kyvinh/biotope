import React from "react";
import {cloudinaryUrl} from "../../lib/constants";
import Link from "next/link";

export const QuestionHeader = ({biotope : b}) => {

    return <section className="biotope-hero" style={b.headerPic && {
        backgroundImage: `url(${cloudinaryUrl}/image/upload/c_scale,e_sharpen:100,w_400,q_auto:good/${b.headerPic}.jpg)`
    }}>
        <div className="overlay"/>
        <div className="biotope-hero-content">
            <Link href={`/b/${b.name}`}><h2 className="link-pointer">{b.longName ? b.longName : b.name}</h2></Link>
        </div>
    </section>
}