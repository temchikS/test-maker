import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

export default function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const handleRegistration = async () => {
        if (username.length < 3) {
            setError('Имя пользователя должно содержать минимум три символа');
            return;
        }
        if (password.length < 5) {
            setError('Пароль должен содержать минимум пять символов');
            return;
        }
        const userData = {
            username: username,
            age: parseInt(age),
            password: password,
            role: "user",
            profilePicturePath:'p',
            makedTests: [],
            passedTests: []
        };
    
        try {
            const response = await fetch('http://26.226.166.33:5228/api/User/RegisterUser/Registration', {
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
                    className='input-login-reg'
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="input-container">
            <input
                className='input-login-reg'
                type="number"
                placeholder="Возраст"
                value={age}
                onChange={(e) => {
                    if (e.target.value <= 100) {
                        setAge(e.target.value);
                    }
                }}
            />
            </div>
            <div className="input-container">
                <input
                    className='input-login-reg'
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
