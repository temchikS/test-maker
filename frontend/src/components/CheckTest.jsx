import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';

export default function CheckTest() {
    const { id } = useParams();
    const [test, setTest] = useState(null);
    const [error, setError] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Состояние для хранения выбранных ответов
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchTestById() {
            try {
                const response = await fetch(`http://localhost:5228/api/Test/GetNotVerifiedTestById/${id}`);
                if (!response.ok) {
                    throw new Error('Ошибка при получении теста');
                }
                const data = await response.json();
                const initialSelectedAnswers = {};
                data.questions.forEach(question => {
                    initialSelectedAnswers[question.questionId] = null;
                });
                setSelectedAnswers(initialSelectedAnswers);
                setTest(data);
                console.log(data);
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
    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:5228/api/Test/VerifyTest/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                console.error('Failed to verify.');
                return;
            }
            console.log('Test verified successfully.');
            navigate('/not-verified-tests');
        } catch (error) {
            console.error('Error vefirfy test:', error);
        }
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
                                            <label htmlFor={`answer-${answer.answerId}`}>{answer.answerText} {answer.IsCorrect ? "Правильный" : "Неправильный"}</label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSubmit}>Отметить тест как проверенный</button>
                </div>
            ) : (
                <div>Загрузка...</div>
            )}
        </div>
    );
}