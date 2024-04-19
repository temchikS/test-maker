import React, { useState } from 'react';

export default function MakeTest() {
    const [testName, setTestName] = useState('');
    const [questions, setQuestions] = useState([{ id: 1, questionText: '', answers: [{ id: 1, answerText: '', isCorrect: false }] }]);
    const [errorMessage, setErrorMessage] = useState('');

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
        if (testName.trim() === '' || questions.some(question => question.questionText.trim() === '' || question.answers.some(answer => answer.answerText.trim() === ''))) {
            setErrorMessage('Пожалуйста, заполните все поля');
            return;
        }
        const username = localStorage.getItem('username');
        const testData = {
            testName: testName,
            createdBy: username,
            questions: questions.map(question => {
                const { id, ...questionWithoutId } = question;
                return {
                    ...questionWithoutId,
                    answers: question.answers.map(answer => {
                        const { id, ...answerWithoutId } = answer;
                        return answerWithoutId;
                    })
                };
            })
        };
        fetch('http://localhost:5228/api/Test/CreateTest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        console.log(testData);
        setErrorMessage('');
    }
    

    return (
        <div className="main">
            <div className="test-make">
                <input
                    type="text"
                    placeholder="Название теста"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
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
