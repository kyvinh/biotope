import {Question} from "./Question";
import {QuestionResults} from "./QuestionResults";
import {useState} from "react";
import {useSession} from "next-auth/react";
import useSWR from "swr";
import {fetcher} from "./util/fetcher";

export const Questionnaire = ({questionnaire, answered= false, questionnaireSubmit, disabled = false}) => {

    const [answers, setAnswers] = useState([])

    const {data: session} = useSession({required: false})

    // Type of questionnairesAnswered = { questionId: { average: Int }
    const {data: resultsObject} = useSWR(session ? `/api/b/${questionnaire.biotope.name}/${questionnaire.id}/results` : null, fetcher);
    /* results:
        [{…}, {…}, {…}]
        0: {questionId: 'ckw25pixk0036c0uznmtotupl', answerText: 'Sale', answerNum: null, _count: 2}
        1: {questionId: 'ckw25piy00044c0uzlzqspuqp', answerText: "c'est sale", answerNum: null, _count: 1}
        2: {questionId: 'ckw25piy00044c0uzlzqspuqp', answerText: 'pas mal propre', answerNum: null, _count: 1}
    */
    const questionResults = resultsObject?.results.reduce(
        (acc, answer) => {
            const questionId = answer.questionId;
            if (acc[questionId]) {
                acc[questionId].push(answer)
            } else {
                acc[questionId] = [answer]
            }
            return acc
        }
    , {})

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
                return <div key={'questionBlock-'+question.id}>
                    <Question key={question.id} question={question} setState={setAnswer} answered={answered} />
                    { answered && questionResults? <QuestionResults key={'results-'+question.id} question={question} results={questionResults[question.id]}/> : null }
                </div>
            })}
            { answered || disabled ? <></>: <input type="submit" value="Submit" />}
        </form>
    </div>

};
