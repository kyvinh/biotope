import {Question} from "./Question";
import {useState} from "react";
import {useSession} from "next-auth/react";
import useSWR from "swr";
import {fetcher} from "./util/fetcher";

export const Questionnaire = ({questionnaire, answered= false, questionnaireSubmit, disabled = false}) => {

    const [answers, setAnswers] = useState([])

    const {data: session} = useSession({required: false})

    // Type of questionnairesAnswered = { questionId: { average: Int }
    const {data: {results}} = useSWR(session ? `/api/b/${questionnaire.biotope.name}/${questionnaire.id}/results` : null, fetcher);
    console.log(results);

    const setAnswer = (questionId, answer) => {
        let newAnswers = answers.filter(element => element.questionId != questionId)
        newAnswers.push({
            questionId: questionId,
            answer: answer
        });
        setAnswers(newAnswers)
    }

    return <div key={questionnaire.id}>
        <h5>{questionnaire.name}</h5>
        <p>{questionnaire.welcomeText}</p>
        <form className={answered ? 'disabled' : ''} onSubmit={e => questionnaireSubmit(e, questionnaire.id, answers)}>
            {questionnaire.questions?.map((question) => {
                return <Question key={question.id} question={question} setState={setAnswer} answered={answered} />
            })}
            { answered || disabled ? <></>: <input type="submit" value="Submit" />}
        </form>
    </div>

};
