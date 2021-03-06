import React, { useState } from "react";
import { useRouter } from "next/router";
import db from '../db.json';
import { Widget } from "../src/components/Widget";
import QuizContainer from '../src/components/QuizContainer';
import QuizBackground from "../src/components/QuizBackground";
import AlternativesForm from "../src/components/AlternativeForm";
import QuizLogo from "../src/components/QuizLogo";
import Button from '../src/components/Button';
import Image from "next/image";
import loadImage from "../src/assets/img/giphy.gif";


function LoadingWidget() {
    return (
        <Widget>
            <Widget.Header>
                Carregando...
            </Widget.Header>

            <Widget.Content>
                <Image src={loadImage} alt="loading image" />
            </Widget.Content>
        </Widget>
    );
}

function ResultWidget({ results }) {
    return (
        <Widget>
            <Widget.Header>
                Tela de Resultados:
            </Widget.Header>

            <Widget.Content>
                {/* {`Parabéns ${roteamento.query.name}, você acertou X questões do Quiz`} */}
                <p>Parabéns!
                </p>
                <img
                    alt="Congratulations! Quiz Finish"
                    style={{
                        width: '100%',
                        height: '20%',
                        objectFit: 'cover',
                    }}
                    src="https://media.giphy.com/media/3oz9ZE2Oo9zRC/giphy.gif"
                />
                <p>

                    Você acertou
                    {'  '}
                    {/* {''}
                    {results.reduce((somatoriaAtual, resultAtual) =>{
                       const isAcerto = resultAtual === true;
                        if(isAcerto){
                            return somatoriaAtual + 1;
                        }

                    }, 0)} */}
                    {results.filter((x) => x).length}
                    {'  '}
                    perguntas
                    <ul>

                        {results.map((result, index) => {

                            <li key={`result ${result}`}>
                                #
                                {index + 1}
                                {' '}
                                {result === true ? 'Acertou' : 'Errou'}
                            </li>
                        })}

                    </ul>

                </p>
            </Widget.Content>
        </Widget>
    );
}



function QuestionWidget({
    question,
    questionIndex,
    totalQuestions,
    onSubmit,
    addResult,
}) {
    const [selectedAlternative, setSelectedAlternative] = useState(undefined);
    const questionId = `question__${questionIndex}`;
    const isCorrect = selectedAlternative === question.answer;
    const [isQuestionSubmited, setIsQuestionSubmited] = useState(false);
    const hasAlternativeSelected = selectedAlternative !== undefined;




    return (
        <Widget>
            <Widget.Header>
                {/* <BackLinkArrow href="/" /> */}
                <h3>
                    {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
                </h3>
            </Widget.Header>

            <img
                alt="Descrição"
                style={{
                    width: '350px',
                    height: '20%',
                    objectFit: 'cover',
                }}
                src={question.image}
            />
            <Widget.Content>
                <h2>
                    {question.title}
                </h2>
                <p>
                    {question.description}
                </p>

                <AlternativesForm
                    onSubmit={(infosDoEvento) => {
                        infosDoEvento.preventDefault();
                        setIsQuestionSubmited(true);
                        setTimeout(() => {
                            addResult(isCorrect);
                            onSubmit();
                            setIsQuestionSubmited(false);
                            setSelectedAlternative(undefined);
                        }, 3 * 1000)
                    }}
                >
                    {question.alternatives.map((alternative, alternativeIndex) => {
                        const alternativeId = `alternative__${alternativeIndex}`;
                        const selectedAlternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
                        const isSelected = selectedAlternative === alternativeIndex;

                        return (
                            <Widget.Topic
                                as="label"
                                htmlFor={alternativeId}
                                key={alternativeId}
                                data-selected={true}
                                data-status={'SUCCESS'}
                            >
                                <input
                                    // style={{ display: 'none' }}
                                    id={alternativeId}
                                    name={questionId}
                                    type="radio"
                                    onChange={() => setSelectedAlternative(alternativeIndex)}
                                />
                                {alternative}
                            </Widget.Topic>
                        );
                    })}

                    //<pre>{JSON.stringify(question, null, 4) </pre> 
                    <Button type="submit" disabled={!hasAlternativeSelected}>
                        Confirmar
                    </Button>
                    <p>Alternativa selecionada:{`${selectedAlternative}`}</p>
                    {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
                    {!isCorrect && <p>Você errou!</p>}
                </AlternativesForm>
            </Widget.Content>
        </Widget>
    );
}

const screenStates = {
    QUIZ: 'QUIZ',
    LOADING: 'LOADING',
    RESULT: 'RESULT',
};

export default function QuizPage() {


    const roteamento = useRouter();
    roteamento.query.name;
    const [results, setResults] = useState([]);
    const [screenState, setScreenState] = useState(screenStates.LOADING);
    const totalQuestions = db.questions.length;
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const questionIndex = currentQuestion;
    const question = db.questions[questionIndex];



    function addResult(result) {
        setResults([
            ...results,
            result
        ])
    }


    // [React chama de: Efeitos || Effects]
    // React.useEffect
    // atualizado === willUpdate
    // morre === willUnmount
    React.useEffect(() => {
        // fetch() ...
        setTimeout(() => {
            setScreenState(screenStates.QUIZ);
        }, 1 * 5000);
        // nasce === didMount
    }, []);


    function handleSubmitQuiz() {
        const nextQuestion = questionIndex + 1;
        if (nextQuestion < totalQuestions) {
            setCurrentQuestion(nextQuestion);
        } else {
            setScreenState(screenStates.RESULT);
        }
    }

    return (
        <QuizBackground backgroundImage={db.bg}>
            <QuizContainer>
                <QuizLogo />
                {screenState === screenStates.QUIZ && (
                    <QuestionWidget
                        question={question}
                        questionIndex={questionIndex}
                        totalQuestions={totalQuestions}
                        onSubmit={handleSubmitQuiz}
                        addResult={addResult}
                    />
                )}

                {screenState === screenStates.LOADING && <LoadingWidget />}

                {screenState === screenStates.RESULT

                    && <ResultWidget results={results} />
                }
            </QuizContainer>
        </QuizBackground>
    );
}
