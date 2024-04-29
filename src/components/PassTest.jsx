import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext} from '../contexts/userContext';
import Header from './Header';
import goldZvezda from '../images/goldZvezda.png';
import goldGrayZvezda from '../images/gold-grayZvezda.png';
import grayZvezda from '../images/grayZvezda.png';
import RatingStars from './Rating';

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
                console.log(data);
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
            setStarted(false);
            setTimeElapsed(0);
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
                    <div className={`test-view-cont ${!isStarted ? '' : 'hidden'}`}>
                        <div className='test-img'>
                            <img className='big-cover-img' src={test.imageUrl} alt="" />
                            <h2>{test.testName}</h2> 
                        </div>
                        <div className='test-info-cont'>
                            <div className='test-info'>
                            <p><strong>Описание:</strong> {test.description}</p>
                            <p><strong>Автор:</strong> {test.createdBy}</p>
                            <p><strong>Теги:</strong> {test.tags.map(tag => tag.tagText).join(', ')}</p>
                            <p><strong>Рейтинг:</strong> </p>
                            <div className='stars-cont'>
                                <div>{renderRatingStars(test.averageRating)}</div>
                            </div>
                        </div>
                        {passedTest ? (
                            <div className='result'>
                                <h3><strong>Результаты прохождения теста:</strong></h3>
                                <p><strong>Результат:</strong> {passedTest.result}/{passedTest.maxQuestions}</p>
                                <p><strong>Время прохождения:</strong> {passedTest.time} секунд</p>
                                <p><strong style={{display:'flex'}}>Оцените тест:<RatingStars testId={id}/></strong></p>
                                
                            </div>
                        ) : null}
                        </div>
                    </div>
                    <button className={!isStarted ? '' : 'hidden'} onClick={handleStart}>Начать тест</button>
                    <div className={`pass-test ${isStarted ? '' : 'hidden'}`}>
                        <p>Времени прошло: {timeElapsed} секунд</p>
                        {test.questions.map((question, index) => (
                            <div className='question' key={question.questionId}>
                                <h3>Вопрос {index + 1}</h3>
                                <p>{question.questionText}</p>
                                <ul>
                                    {question.answers.map(answer => (
                                        <li className='answer' key={answer.answerId}  onClick={() => document.getElementById(`answer-${answer.answerId}`).click()}>
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
                        <button style={{width:'300px'}} onClick={handleSubmit}>Отправить ответы</button>
                    </div>
                </div>
            ) : (
                <div>Загрузка...</div>
            )}
        </div>
    );
}
