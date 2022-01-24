import {useRouter} from "next/router";
import {QuestionContainer} from "../../../../components/QuestionContainer";
import {useBiotope} from "../../../../components/util/hooks";
import Link from "next/link";
import React from "react";

export default function QuestionHome() {

    const {questionId, name} = useRouter().query
    const {biotope: b, reloadBiotope} = useBiotope(name as string)
    const question = b?.questions?.find((element) => element.id === questionId)

    return question ? <>
        <h1><Link href={`/b/${b.name}`}>Biotope Terlinden</Link></h1>
        <QuestionContainer key={question.id} question={question} disabled={!b.isAuthorized} onQuestionUpdated={reloadBiotope}/>
    </> : null
}