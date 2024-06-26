import React, { useState } from 'react';
import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';
import krestik from '../images/krestik.png';
import './MakeTest.css'

export default function MakeTest() {
    const [testName, setTestName] = useState('');
    const [questions, setQuestions] = useState([{ id: 1, questionText: '', answers: [{ id: 1, answerText: '', isCorrect: false }] }]);
    const [coverImage, setCoverImage] = useState(null);
    const [description,setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [customTag, setCustomTag] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    function addQuestion() {
        const newQuestion = { id: questions.length + 1, questionText: '', answers: [{ id: 1, answerText: '', isCorrect: false }] };
        setQuestions([...questions, newQuestion]);
    }

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
                    } else if (answer.isCorrect) {
                        return { ...answer, isCorrect: false };
                    }
                    return answer;
                });
                return { ...question, answers: updatedAnswers };
            }
            return question;
        });
        setQuestions(updatedQuestions);
    }

    function handleSubmit() {
        if (questions.length === 0) {
            setErrorMessage('Добавьте хотя бы один вопрос');
            return;
        }
        
        const hasAtLeastTwoAnswers = questions.every(question => question.answers.length >= 2);
        if (!hasAtLeastTwoAnswers) {
            setErrorMessage('Каждый вопрос должен иметь как минимум два варианта ответа');
            return;
        }
        const hasAtLeastOneCorrectAnswer = questions.every(question => question.answers.some(answer => answer.isCorrect));
        if (!hasAtLeastOneCorrectAnswer) {
            setErrorMessage('Каждый вопрос должен иметь хотя бы один правильный ответ');
            return;
        }
        const username = localStorage.getItem('username');
    
        const formData = new FormData();
        formData.append('testName', testName);
        formData.append('createdBy', username);
        formData.append('coverImage', coverImage);
        formData.append('description', description);
        formData.append('rating', 0);
        formData.append('ImageUrl', null);
        formData.append('userRating', []);
        tags.forEach((tag, index) => {
            formData.append(`tags[${index}].tagText`, tag.tagText);
        });
        questions.forEach((question, index) => {
            formData.append(`questions[${index}].questionText`, question.questionText);
            question.answers.forEach((answer, ansIndex) => {
                formData.append(`questions[${index}].answers[${ansIndex}].answerText`, answer.answerText);
                formData.append(`questions[${index}].answers[${ansIndex}].isCorrect`, answer.isCorrect);
            });
        });
        fetch('http://26.226.166.33:5228/api/Test/CreateTest', {
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

    function removeTag(tagToRemove) {
        setTags(tags.filter(tag => tag !== tagToRemove));
    }

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        setCoverImage(file);
    };

    function handleAddTag() {
        if (customTag.trim() !== '') {
            setTags([...tags, { tagText: customTag }]);
            setCustomTag('');
        }
    }
    function resizeInput(e) {
        const input = e.target;
        input.style.width = 0;
        input.style.width = input.scrollWidth + 'px'; 
    }
    
    return (
        <div className="main">
            <Header/>
            <div className="test-make">
            <label class="form-label text-hint mb-1"> Изображение :
                <input
                    type="file"
                    accept="image/*" 
                    onChange={handleCoverImageChange}
                /> </label>
                <div   className='text-name'>
                    <input
                    className='make-test-input'
                    onInput={resizeInput}
                    type="text"
                    placeholder="Название теста"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                /></div>
                <div className='text-name'>
                <input
                    onInput={resizeInput}
                    type="text"
                    className='make-test-input'
                    placeholder="Описание"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                /></div>
                
                {questions.map((question, questionIndex) => (
                        <div className='question-maketest' key={question.id}>
                        <input
                            type="text"
                            className='make-test-input'
                            onInput={resizeInput}
                            placeholder={`Вопрос ${questionIndex + 1}`}
                            value={question.questionText}
                            onChange={(e) => {
                                const newQuestions = [...questions];
                                newQuestions[questionIndex].questionText = e.target.value;
                                setQuestions(newQuestions);
                            }}
                        />
                        {question.answers.map((answer, answerIndex) => (
                            <div key={answer.id} className="answer-container">
                                <input
                                    type="text"
                                    onInput={resizeInput}
                                    placeholder={`Ответ ${answerIndex + 1}`}
                                    className='make-test-input'
                                    value={answer.answerText}
                                    onChange={(e) => {
                                        const newQuestions = [...questions];
                                        newQuestions[questionIndex].answers[answerIndex].answerText = e.target.value;
                                        setQuestions(newQuestions);
                                    }}
                                />
                                <div className="answer-buttons">
                                    <button className={`maketest-button ${answer.isCorrect ? 'correct-answer' : 'incorrect-answer'}`} onClick={() => MakeItRight(question.id, answer.id)}>
                                        {answer.isCorrect ? "✔" : "❌"}
                                    </button>
                                </div>
                            </div>
                           
                        ))}
                        <button className="create-new" onClick={() => addAnswer(question.id)}>Добавить ответ</button>
                    </div>
                ))}
                <button className="add-answ-btn" onClick={addQuestion}>Добавить вопрос</button>
                <div>
                    <label>Выбранные теги:</label>
                    <ul>
                        {tags.map((tag, index) => (
                            <li className='teg' key={index}><img src={krestik} className='remove-teg-img' alt='remove-teg' onClick={() => removeTag(tag)}/>{tag.tagText}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <label>Добавить собственный тег:</label>
                    <input
                        type="text"
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                    />
                    <button onClick={handleAddTag}>Добавить</button>
                </div>
                <button onClick={handleSubmit}>Создать тест</button>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </div>
        </div>
    );
}