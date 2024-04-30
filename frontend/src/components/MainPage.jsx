import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import makedTests from '../images/makedtest.png';
import passedTests from '../images/passedTests.png';
import goldZvezda from '../images/goldZvezda.png';
import goldGrayZvezda from '../images/gold-grayZvezda.png';
import grayZvezda from '../images/grayZvezda.png';  
export default function MainPage() {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);

    const [tests, setTests] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch(`http://26.226.166.33:5228/api/User/GetUserData`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login');
                        throw new Error('Unauthorized');
                    } else {
                        throw new Error('Ошибка при выполнении запроса');
                    }
                }
                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error('Произошла ошибка при выполнении запроса:', error);
                setError(error.message);
            }
        }
        fetchUserData();
    }, []);

    useEffect(() => {
        async function fetchTests() {
            try {
                const response = await fetch(`http://26.226.166.33:5228/api/Test/GetActualTests`);
                if (!response.ok) {
                    throw new Error('Ошибка при получении тестов');
                }
                const data = await response.json();
                console.log(data);
                setTests(data);
            } catch (error) {
                console.error('Произошла ошибка при получении тестов:', error);
                setError(error.message);
            }
        }
        fetchTests();
    }, []);
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

    if (!userInfo) {
        return <div>Loading...</div>; 
    }

    return (
        <div className="main">
            <Header/>
            <div className='main-section'>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <Link style={{width:375,display:'flex'}} className='link-unstyled' to={'/profile'}>
                        <div className='section statistic'>
                            <p>Статистика</p>
                            <div className='statistic-test'>
                                <img src={passedTests} alt="passedTests img" />
                                <label>Тестов<br/>пройдено</label>
                                {userInfo.passedTestsCount}
                            </div>
                            <div className='statistic-test'>
                                <img src={makedTests} alt="makedTests img" />
                                <label>Тестов<br/>создано</label>
                                {userInfo.createdTestsCount}
                            </div>
                        </div>
                    </Link>
                <div className='maketest-link'>
                <p>Попробуй создать свой тест:</p>
                    <Link className='link-unstyled' to={'/MakeTest'}>
                        
                        <button>Создать тест</button>
                    </Link>
                    
                     </div>
                </div>
                
                <div className='section actual-tests-section'>
                    <h2>Актуальные тесты <Link className='link-unstyled' style={{marginLeft:50,fontSize:10,textDecoration:'underline'}} to={'/all-tests'}>См. все тесты</Link></h2>
                    <div className='tests-map'>
                        {tests.map(test => (
                        <Link className='link-unstyled' key={test.id} to={`/pass-test/${test.testName}/${test.id}`}>
                            <div className='test-card'>
                                <img className='cover-img' src={test.imageUrl} alt="cover image" />
                                <h3>{test.testName}</h3>
                                <p>Описание: {test.description}</p>
                                <p>Теги: {test.tags.length > 3 ? test.tags.slice(0, 3).map(tag => tag.tagText).join(', ') + ' ...' : test.tags.map(tag => tag.tagText).join(', ')}</p>
                                <div className='stars-cont'>
                                    <div>{renderRatingStars(test.averageRating)}</div>
                                </div>
                            </div>
                        </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
