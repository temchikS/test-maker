import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function MainPage() {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [tests, setTests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch('http://localhost:5228/api/User/MainPage', {
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (error === 'Unauthorized') {
        navigate('/login');
    }

    function toggleSideBar() {
        setShowSidebar(!showSidebar);
    }

    return (
        <div className="main">
            <div className='HeaderStyle'>
                <div className='mini-profile our-logo'>
                    <img src="" alt="logo" />
                    <p>название</p>
                </div>
                <div className='mini-profile'>
                    <p>{userInfo && userInfo.username}</p>
                    <img onClick={toggleSideBar} className='user-avatar' src="https://avatars.mds.yandex.net/i?id=dd8fe0b2db4aeb94c73c17ff7a3ea0ddc7405232-12423213-images-thumbs&n=13" alt="avatar" />
                </div>
                <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
                    <button onClick={toggleSideBar}>закрыть</button>
                    <h1>Меню</h1>
                    <div className='menu'>
                        <ul>
                            <li>Профиль</li>
                            <li>Настройки</li>
                            <li>ЧОТА еще</li>
                        </ul>
                    </div>
                    <button onClick={handleLogout}>Выйти</button>
                </div>
            </div>
            <div className='main main-section'>
                <div className='statistic'>
                    статистика
                </div>
                <div className='main actual-tests-section'>
                    <h2>Актуальные тесты</h2>
                    {tests.map(test => (
                        <Link key={test.id} to={`/pass-test/${test.id}`}>
                            <div className='test-card'>
                                <h3>{test.testName}</h3>
                                <p>Автор: {test.createdBy}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
