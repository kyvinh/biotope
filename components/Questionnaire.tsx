import {Question} from "./Question";
import {QuestionResults} from "./QuestionResults";
import {Arguments} from "./Arguments";
import {fetcher} from "./util/fetcher";
import useSWR from "swr";
import React, {useState} from "react";
import {useSession} from "next-auth/react";
import {Accordion, useAccordionButton} from "react-bootstrap";

export const Questionnaire = ({questionnaire, disabled = false}) => {

    const [answers, setAnswers] = useState([])
    const {data: session} = useSession({required: false})

    // Whether the user has answered questions in this questionnaire or not
    // Type of questionnairesAnswered = [ { questionId, answerCount} ]
    const {data: questionsAnswered} = useSWR(session ? `/api/user/questionnaire/${questionnaire.id}` : null, fetcher);

    const questionsAnsweredCount = questionsAnswered?.reduce((acc, question) => acc + question.hasAnswer, 0)
    const questionnaireAnswered = questionnaire.questions.length === questionsAnsweredCount;

    // Results of the votes (include comments?) on this questionnaire
    // Type of resultsObject = { questionId: { average: Int }
    const {data: resultsObject} = useSWR(session ? `/api/q/${questionnaire.id}/results` : null, fetcher);
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

    const questionnaireSubmit = async (event, questionnaireId, answers) => {
        event.preventDefault();
        event.target.disabled = true;

        if (session) {
            const res = await fetcher(`/api/q/${questionnaireId}/answer`, { answers: answers});

            if (res?.status == 'ok') {
                // Answers have been submitted
            }
        } else {
            // how to handle anonymous answers? only available to certain types of questionnaires?
            // by default, there shall not be anonymous votes
            // - private biotopes cannot be accessed by anonymous users
            throw new Error("Currently no anonymous vote allowed!")
        }
    }

    return <div key={questionnaire.id} className="questionnaire-container">
        <h5>{questionnaire.name}</h5>
        <div className="card-body">
            <h6>{questionnaire.welcomeText}</h6>

            { questionnaire.questions?.length > 0 ?
                <Accordion defaultActiveKey={`accordion-key-${questionnaire.questions[0].id}`} id={`accordion-${questionnaire.id}`} flush>
                    { questionnaire.questions.map((question, i) => {
                            const questionAnswered = questionsAnswered?.find(element => element.questionId === question.id);
                            const answered = questionAnswered?.hasAnswer > 0;
                            return <Accordion.Item key={`accordion-item-${question.id}`} eventKey={`accordion-key-${question.id}`}>
                                <Accordion.Header>({i+1}/{questionnaire.questions.length})&nbsp;<b>{question.name}</b></Accordion.Header>
                                <Accordion.Body>
                                    <Question question={question} setState={setAnswer} answered={answered} showTitle={false} />

                                    { i+1 == questionnaire.questions.length ?
                                        <input type="submit" value="Submit" onClick={e => questionnaireSubmit(e, questionnaire.id, answers)}/>
                                    :
                                        <NextQuestionButton eventKey={`accordion-key-${questionnaire.questions[i+1].id}`}>Next</NextQuestionButton>
                                    }

                                    { answered && questionResults?
                                        <>
                                            <QuestionResults results={questionResults[question.id]}/>
                                            <Arguments question={question} questionArguments={question.arguments} />
                                        </>
                                        : null
                                    }
                                </Accordion.Body>
                            </Accordion.Item>
                        }
                    )}
                </Accordion>
            : null }
        </div>
    </div>
};

function NextQuestionButton({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey);

    return (
        <button type="button" onClick={decoratedOnClick}>
            {children}
        </button>
    );
}