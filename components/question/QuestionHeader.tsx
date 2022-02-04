import React from "react";
import {cloudinaryUrl} from "../../lib/constants";

export const QuestionHeader = ({biotope : b}) => {

    return <section className="biotope-hero" style={b.headerPic && {
        backgroundImage: `url(${cloudinaryUrl}/image/upload/c_scale,e_sharpen:100,w_400,q_auto:good/${b.headerPic}.jpg)`
    }}>
        <div className="overlay"/>
        <div className="biotope-hero-content">
            <h2>{b.longName ? b.longName : b.name}</h2>
        </div>
    </section>
}