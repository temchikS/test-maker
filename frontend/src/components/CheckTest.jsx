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
                const response = await fetch(`http://26.226.166.33:5228/api/Test/GetNotVerifiedTestById/${id}`);
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
            const response = await fetch(`http://26.226.166.33:5228/api/Test/VerifyTest/${id}`, {
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
    const handleDelete = async () => {
        try{
            const response = await fetch(`http://26.226.166.33:5228/api/Test/DeleteTest/${id}`,{
                method:'DELETE'
            });
            if (!response.ok) {
                throw new Error('Ошибка при удалении');
            }
            navigate('/not-verified-tests');
        }catch (error) {
            console.error('Error delete test:', error);
        }
    };

    return (
        <div className="main">
            <Header/>
            {test ? (
                <div>
                    <img src={test.imageUrl} alt="" />
                    <h2>{test.testName}</h2>
                    <p>Автор: {test.createdBy}</p>
                    <p>Описание: {test.description}</p>
                    <div>
                        <p>Теги: {test.tags.map(tag => tag.tagText).join(', ')}</p>
                    </div>
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
                                            <label htmlFor={`answer-${answer.answerId}`}>{answer.answerText} {answer.isCorrect ? "Правильный" : "Неправильный"}</label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSubmit}>Одобрить</button>
                    <button onClick={handleDelete}>Удалить</button>
                </div>
            ) : (
                <div>Загрузка...</div>
            )}
        </div>
    );
}