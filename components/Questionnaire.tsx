import {Question} from "./Question";
import {useState} from "react";

export const Questionnaire = ({questionnaire, answered= false, questionnaireSubmit, disabled = false}) => {

    const [answers, setAnswers] = useState([])

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
