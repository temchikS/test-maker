import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';

export default function MainPage() {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);

    const [tests, setTests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch('http://localhost:5228/api/User/GetUserData', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    if (response.status === 401) {
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
                const response = await fetch('http://localhost:5228/api/Test/GetTests');
                if (!response.ok) {
                    throw new Error('Ошибка при получении тестов');
                }
                const data = await response.json();
                setTests(data);
            } catch (error) {
                console.error('Произошла ошибка при получении тестов:', error);
                setError(error.message);
            }
        }
        fetchTests();
    }, []);

    if (!userInfo) {
        return <div>Loading...</div>; 
    }

    return (
        <div className="main">
            <Header/>
            <div className='main-section'>
                <div className='section statistic'>
                    статистика
                </div>
                <div className='section actual-tests-section'>
                    <h2>Актуальные тесты</h2>
                    <div className='tests-map'>
                        {tests.map(test => (
                        <Link className='link-unstyled' key={test.id} to={`/pass-test/${test.testName}/${test.id}`}>
                            <div className='test-card'>
                                <img className='cover-img' src={test.coverImagePath} alt="cover image" />
                                <h3>{test.testName}</h3>
                                <p>Автор: {test.createdBy}</p>
                            </div>
                        </Link>
                    ))}</div>
                    
                </div>
            </div>
        </div>
    );
}
