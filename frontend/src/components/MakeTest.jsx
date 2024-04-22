import React, { useState } from 'react';
import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';

export default function MakeTest() {
    const [testName, setTestName] = useState('');
    const [questions, setQuestions] = useState([{ id: 1, questionText: '', answers: [{ id: 1, answerText: '', isCorrect: false }] }]);
    const [coverImage, setCoverImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    function addQuestion() {
        const newQuestion = { id: questions.length + 1, questionText: '', answers: [{ id: 1, answerText: '', isCorrect: false }] };
        setQuestions([...questions, newQuestion]);
    };

    function addAnswer(questionId) {
        const updatedQuestions = questions.map(question => {
            if (question.id === questionId) {
                const newAnswer = { id: question.answers.length + 1, answerText: '', isCorrect: false };
                return { ...question, answers: [...question.answers, newAnswer] };
            }
            return question;
        });
        setQuestions(updatedQuestions);
    }

    function MakeItRight(questionId, answerId) {
        const updatedQuestions = questions.map(question => {
            if (question.id === questionId) {
                const updatedAnswers = question.answers.map(answer => {
                    if (answer.id === answerId) {
                        return { ...answer, isCorrect: true };
                    }
                    return { ...answer, isCorrect: false }; // Сбрасываем все остальные ответы в неправильное состояние
                });
                return { ...question, answers: updatedAnswers };
            }
            return question;
        });
        setQuestions(updatedQuestions);
    }
    function handleSubmit() {
        // Проверяем, что есть хотя бы один вопрос
        if (questions.length === 0) {
            setErrorMessage('Добавьте хотя бы один вопрос');
            return;
        }
        
        // Проверяем, что каждый вопрос имеет минимум два варианта ответа
        const hasAtLeastTwoAnswers = questions.every(question => question.answers.length >= 2);
        if (!hasAtLeastTwoAnswers) {
            setErrorMessage('Каждый вопрос должен иметь как минимум два варианта ответа');
            return;
        }
    
        // Проверяем, что хотя бы один из вариантов ответа помечен как правильный
        const hasAtLeastOneCorrectAnswer = questions.every(question => question.answers.some(answer => answer.isCorrect));
        if (!hasAtLeastOneCorrectAnswer) {
            setErrorMessage('Каждый вопрос должен иметь хотя бы один правильный ответ');
            return;
        }
    
        // Проверки пройдены, можно отправлять данные на сервер
        const username = localStorage.getItem('username');
    
        const formData = new FormData();
        formData.append('testName', testName);
        formData.append('createdBy', username);
        formData.append('coverImage', coverImage);
        formData.append('tags', []);
        formData.append('userRating', []);
        questions.forEach((question, index) => {
            formData.append(`questions[${index}].questionText`, question.questionText);
            question.answers.forEach((answer, ansIndex) => {
                formData.append(`questions[${index}].answers[${ansIndex}].answerText`, answer.answerText);
                formData.append(`questions[${index}].answers[${ansIndex}].isCorrect`, answer.isCorrect);
            });
        });
    
        fetch('http://localhost:5228/api/Test/CreateTest', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            navigate('/');
        })
        .catch(error => {
            console.error('Error:', error);
            setErrorMessage('Ошибка при отправке данных');
        });
    }
    
    
    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        setCoverImage(file);
    };

    return (
        <div className="main">
            <Header/>
            <div className="test-make">
                <input
                    type="text"
                    placeholder="Название теста"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                />
                 <input
                    type="file"
                    accept="image/*" 
                    onChange={handleCoverImageChange}
                />
                {questions.map((question, questionIndex) => (
                    <div key={question.id}>
                        <input
                            type="text"
                            placeholder={`Вопрос ${questionIndex + 1}`}
                            value={question.questionText}
                            onChange={(e) => {
                                const newQuestions = [...questions];
                                newQuestions[questionIndex].questionText = e.target.value;
                                setQuestions(newQuestions);
                            }}
                        />
                        {question.answers.map((answer, answerIndex) => (
                            <div key={answer.id}>
                                <input
                                    type="text"
                                    placeholder={`Ответ ${answerIndex + 1}`}
                                    value={answer.answerText}
                                    onChange={(e) => {
                                        const newQuestions = [...questions];
                                        newQuestions[questionIndex].answers[answerIndex].answerText = e.target.value;
                                        setQuestions(newQuestions);
                                    }}
                                />
                                <button onClick={() => MakeItRight(question.id, answer.id)}>
                                    {answer.isCorrect ? "Правильный" : "Не правильный"}
                                </button>
                            </div>
                        ))}
                        <button onClick={() => addAnswer(question.id)}>Добавить ответ</button>
                    </div>
                ))}
                <button className="add-answ-btn" onClick={addQuestion}>Добавить вопрос</button>
                <button onClick={handleSubmit}>Подтвердить</button>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </div>
        </div>
    );
}
