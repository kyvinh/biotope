import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {QuestionContainer} from "../../../../components/QuestionContainer";
import {useBiotope, useBiotopeUserHistory} from "../../../../components/util/hooks";
import {isAuthorized} from "../index";

export default function QuestionHome() {

    const {data: session} = useSession({required: false})   // Required = false -> session might be null
    const {questionId, name} = useRouter().query
    const {biotope: b, reloadBiotope} = useBiotope(name as string)
    const {error: authorizationError} = useBiotopeUserHistory(name as string)

    const authorized = isAuthorized(session, b, authorizationError)
    const question = b?.questions.find((element) => element.id === questionId)

    return question ? <>
        <QuestionContainer key={question.id} question={question} disabled={!authorized} onQuestionUpdated={reloadBiotope}/>
    </> : null
}