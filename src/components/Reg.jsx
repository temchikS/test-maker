import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [fio, setFio] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState(null);

    const handleRegistration = async () => {
        const userData = {
            username: username,
            fio: fio,
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
                setLoggedIn(true);
            }
    
        } catch (error) {
            console.error('Произошла ошибка при выполнении запроса:', error);
        }
    };
    
    if (loggedIn) {
        return <Navigate to="/welcome" />;
    }
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
                    type="text"
                    placeholder="ФИО"
                    value={fio}
                    onChange={(e) => setFio(e.target.value)}
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
