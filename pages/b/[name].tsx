import { Question } from '../../components/Question'
import {useBiotope} from "../../components/util/hooks";
import {useRouter} from "next/router";

export default function BiotopeHome() {

    const { name } = useRouter().query
    const {biotope: b} = useBiotope(name)

    return b ? (
        <div className="container">
                    <div><h4>{b.name}</h4><span>{b.creator.name}</span> on {b.createdOn}</div>
                    <div>{b.invitations ? b.invitations.length : "0"} invitation(s)</div>
                    { b.contact ?
                        <div>Contact possible: {b.contact}</div>
                        : <div/>}
                    <div>
                    { b.questionnaires ? b.questionnaires.map((questionnaire) => {
                        return <div key={questionnaire.id}>
                            <h5>{questionnaire.name}</h5>
                            { questionnaire.questions?.map((question) => {
                                question.questionnaire = questionnaire  // Fill the relation for rendering in Question comp
                                return <Question key={question.id} question={question} />
                            })}
                        </div>
                    }) : null}
                    </div>
        </div>
    ) : null
}