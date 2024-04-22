import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';

export default function PassTest() {
    const { id } = useParams();
    const [test, setTest] = useState(null);
    const [error, setError] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Состояние для хранения выбранных ответов

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

    if (error) {
        return <div>Произошла ошибка: {error}</div>;
    }

    const handleAnswerSelect = (questionId, answerId) => {
        setSelectedAnswers(prevState => ({
            ...prevState,
            [questionId]: answerId
        }));
    };

    const handleSubmit = () => {
        // Вы можете добавить код для отправки выбранных ответов на сервер
    };

    return (
        <div className="main">
            <Header/>
            {test ? (
                <div>
                    <h2>{test.testName}</h2>
                    <p>Автор: {test.createdBy}</p>
                    <div>
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
                    </div>
                    <button onClick={handleSubmit}>Отправить ответы</button>
                </div>
            ) : (
                <div>Загрузка...</div>
            )}
        </div>
    );
}
