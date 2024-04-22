import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';

export default function PassTest() {
    const { id } = useParams();
    const [test, setTest] = useState(null);
    const [error, setError] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Состояние для хранения выбранных ответов
    const [isStarted, setStarted] = useState(false);
    const [isFinished, setFinished] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        async function fetchTestById() {
            try {
                const response = await fetch(`http://localhost:5228/api/Test/GetVerifiedTestById/${id}`);
                if (!response.ok) {
                    throw new Error('Ошибка при получении теста');
                }
                const data = await response.json();
                // Инициализируем состояние выбранных ответов для каждого вопроса
                const initialSelectedAnswers = {};
                data.questions.forEach(question => {
                    initialSelectedAnswers[question.questionId] = null;
                });
                setSelectedAnswers(initialSelectedAnswers);
                setTest(data);
            } catch (error) {
                console.error('Произошла ошибка при получении теста:', error);
                setError(error.message);
            }
        }
        fetchTestById();
    }, [id]); 

    useEffect(() => {
        let intervalId;
        if (isFinished) {
            intervalId = setInterval(() => {
                setTimeElapsed(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [isFinished]);

    if (error) {
        return <div>Произошла ошибка: {error}</div>;
    }

    const handleAnswerSelect = (questionId, answerId) => {
        setSelectedAnswers(prevState => ({
            ...prevState,
            [questionId]: answerId
        }));
    };

    const handleStart = () => {
        setStarted(true);
        setFinished(true);
    };

    const handleSubmit = () => {
        // Здесь вы можете добавить код для отправки выбранных ответов на сервер
        // После отправки можно сделать проверку ответов на правильность, используя свойство IsCorrect
        // Например:
        const correctAnswers = test.questions.filter(question => {
            const selectedAnswerId = selectedAnswers[question.questionId];
            return selectedAnswerId && question.answers.find(answer => answer.answerId === selectedAnswerId).isCorrect;
        });
        setFinished(false);
        console.log('Количество правильных ответов:', correctAnswers.length);
    };

    return (
        <div className="main">
            <Header/>
            {test ? (
                <div>
                    <img src={test.coverImagePath} alt="" />
                    <h2>{test.testName}</h2>
                    <p>Автор: {test.createdBy}</p>
                    <button className={!isStarted ? '' : 'hidden'} onClick={handleStart}>Начать тест</button>
                    <div className={`pass-test ${isStarted ? '' : 'hidden'}`}>
                        <p>Времени прошло: {timeElapsed} секунд</p>
                        {test.questions.map(question => (
                            <div key={question.questionId}>
                                <p>{question.questionText}</p>
                                <ul>
                                    {question.answers.map(answer => (
                                        <li key={answer.answerId}>
                                            <input
                                                type="radio"
                                                name={`question-${question.questionId}`}
                                                id={`answer-${answer.answerId}`}
                                                value={answer.answerId}
                                                onChange={() => handleAnswerSelect(question.questionId, answer.answerId)}
                                                checked={selectedAnswers[question.questionId] === answer.answerId}
                                            />
                                            <label htmlFor={`answer-${answer.answerId}`}>{answer.answerText}</label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <button onClick={handleSubmit}>Отправить ответы</button>
                    </div>
                </div>
            ) : (
                <div>Загрузка...</div>
            )}
        </div>
    );
}
