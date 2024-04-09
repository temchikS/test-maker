import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

export default function ProfilePage() {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
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
                console.log(localStorage.getItem('token'));
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Unauthorized');
                    } else {
                        throw new Error('Ошибка при выполнении запроса');
                    }
                }
                const data = await response.json();
                setUserInfo(data);
                console.log(data);
            } catch (error) {
                console.error('Произошла ошибка при выполнении запроса:', error);
                setError(error.message);
            }
        }
        fetchUserData();
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login'); // Программное перенаправление на страницу входа
    };

    if (error === 'Unauthorized') {
        return <Navigate to="/login" />;
    }

    return (
        <div className='login-container'>
            <div className='background'>
                <button onClick={handleLogout}>Выйти</button>
                <h1>WELCOME!!!!!!!!!</h1>   
                {userInfo && (
                    <p>Привет, {userInfo.username} (Возраст: {userInfo.userAge})</p>
                )}
            </div>
        </div>
    );
}
