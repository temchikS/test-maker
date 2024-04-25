import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext} from '../contexts/userContext';
import Header from './Header';
import goldZvezda from '../images/goldZvezda.png';
import goldGrayZvezda from '../images/gold-grayZvezda.png';
import grayZvezda from '../images/grayZvezda.png';

export default function PassTest() {
    const { id } = useParams();
    const [test, setTest] = useState(null);
    const [error, setError] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isStarted, setStarted] = useState(false);
    const [isFinished, setFinished] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [passedTest,setPassedTest] = useState(null);
    const userInfo = useContext(UserContext);
    useEffect(() => {
        async function fetchTestById() {
            try {
                const response = await fetch(`http://26.226.166.33:5228/api/Test/GetVerifiedTestById/${id}`);
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
            } catch (error) {
                console.error('Произошла ошибка при получении теста:', error);
                setError(error.message);
            }
        }
        fetchTestById();
    }, [id]); 
    useEffect(() => {
        async function fetchTestById() {
            try {
                const response = await fetch(`http://26.226.166.33:5228/api/Test/GetUserPassedTest/PassedTest/${id}/${userInfo.userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Ошибка при получении пройденного теста');
                }
                const data = await response.json();
                setPassedTest(data);
                console.log(data);
            } catch (error) {
                console.error('Произошла ошибка при получении пройденного теста:', error);
            }
        }
        if (userInfo) {
            fetchTestById();
        }
    }, [userInfo,isFinished]);
    
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

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('passedTestId', id);
            formData.append('time', timeElapsed);
            formData.append('result', calculateResult());
            formData.append('maxQuestions', test.questions.length);
    
            const response = await fetch(`http://26.226.166.33:5228/api/User/PassTest/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
    
            if (!response.ok) {
                throw new Error('Ошибка при прохождении теста');
            }
            setFinished(false);
            const data = await response.text();
            console.log(data); // Обработка успешного ответа
        } catch (error) {
            console.error('Произошла ошибка при прохождении теста:', error);
        }
    };
    
    const calculateResult = () => {
        // Расчет результата
        const correctAnswers = test.questions.filter(question => {
            const selectedAnswerId = selectedAnswers[question.questionId];
            return selectedAnswerId && question.answers.find(answer => answer.answerId === selectedAnswerId).isCorrect;
        });
        return correctAnswers.length;
    };

    // Функция для отображения рейтинга в виде звёздочек
    const renderRatingStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<img key={i} className='star' src={goldZvezda} alt="gold star" />);
            } else {
                stars.push(<img key={i} className='star' src={grayZvezda} alt="gray star" />);
            }
        }
        return stars;
    };

    return (
        <div className="main">
            <Header/>
            {test ? (
                <div className='test-view'>
                    <div className='test-img'>
                        <img className='big-cover-img' src={test.imageUrl} alt="" />
                        <h2>{test.testName}</h2> 
                    </div>
                    <div className='test-info-cont'>
                        <div className='test-info'>
                            <p>Описание: {test.description}</p>
                            <p>Автор: {test.createdBy}</p>
                            <p>Теги: {test.tags.map(tag => tag.tagText).join(', ')}</p>
                            <div className='stars-cont'>{renderRatingStars(test.rating)}</div>

                        </div>
                        {passedTest ? (
                        <div className='result'>
                            <h2>Результаты прохождения теста:</h2>
                            <p>Результат: {passedTest.result}/{passedTest.maxQuestions}</p>
                            <p>Время прохождения: {passedTest.time} секунд</p>
                        </div>
                    ) : null}
                    </div>
                    
                    

                    {/* Вывод рейтинга в виде звёздочек */}
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
