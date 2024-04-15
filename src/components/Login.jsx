import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import './loginstyle.css';


export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Пожалуйста, введите логин и пароль');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5228/api/User/Autorization/Login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('Неправильный логин или пароль');
                } else {
                    throw new Error('Ошибка при выполнении запроса');
                }
            } else {
                setLoggedIn(true);
            }
        } catch (error) {
            console.error('Произошла ошибка при выполнении запроса:', error);
            setError(error.message);
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
                    placeholder="Логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
            <button onClick={handleLogin}>Войти</button>
            {error && <p className="error-message">{error}</p>}
            <div className="register-link-container">
                <Link to="/reg" className="register-link">
                    <p>Нет аккаунта? Зарегистрируйтесь</p>
                </Link>
            </div>
            <div className='americaya'>
                <h2>AMERICA YA :D</h2>
            </div>
    </div>
    
    
    );
}
