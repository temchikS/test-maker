import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

export default function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const handleRegistration = async () => {
        const userData = {
            username: username,
            age: parseInt(age),
            password: password,
            role: "user"
        };
    
        try {
            const response = await fetch('http://localhost:5228/api/User/RegisterUser/Registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
    
            if (!response.ok) {
                if (response.status === 400) {
                    setError('Пользователь с таким именем уже существует');
                }
                throw new Error('Ошибка при регистрации');
            } else {
                localStorage.removeItem('token');
                navigate('/login');
            }
    
        } catch (error) {
            console.error('Произошла ошибка при выполнении запроса:', error);
        }
    };
    
    return (
        <div className="login-container">
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="input-container">
                <input
                    type="number"
                    placeholder="Возраст"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
            </div>
            <div className="input-container">
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className='americaya'>
                <h2>AMERICA YA :D</h2>
            </div>
            <button onClick={handleRegistration}>Регистрация</button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}
