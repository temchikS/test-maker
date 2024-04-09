import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import "./MainPage.css";
export default function MainPage() {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    function Panel1() {
        return (
            <div className='panel'>
                <button>Действие 3</button>
                <button>Действие 2</button>
                <button>Действие 1</button>
            </div>
        );
    }

    function Panel2() {
        return (
            <div className='panel'>
                <button>Действие 1</button>
                <button>Действие 2</button>
                <button>Действие 3</button>
            </div>
        );
    }

    function ButtonWithPanel({ children, panelComponent: Panel }) {
        const [panelVisible, setPanelVisible] = useState(false);

        const togglePanel = () => {
            setPanelVisible(!panelVisible);
        };

        return (
            <div className='style' style={{ position: 'relative' }}>
                <button onClick={togglePanel}>{children}</button>
                {panelVisible && <Panel />}
            </div>
        );
    }
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
    <div className="Welcome">
        <div className='HeaderStyle'>
            <div className='Header-Logo'>
                <img src="https://avatars.mds.yandex.net/i?id=dd8fe0b2db4aeb94c73c17ff7a3ea0ddc7405232-12423213-images-thumbs&n=13" alt="Hentai" />
            </div>
            
            <div className='Header-Button'>
                  <ButtonWithPanel panelComponent={Panel1}>Ez solo</ButtonWithPanel>
                  <ButtonWithPanel panelComponent={Panel2}>Ez solo2</ButtonWithPanel>
            </div>
            <div className='Header-Navigacion'>
                <p>О нас</p>
            </div>

        </div>
        {userInfo && (
            <p>Привет, {userInfo.username} (Возраст: {userInfo.userAge})</p>
            )}
        <button onClick={handleLogout}>Выйти</button>
    </div>
    );
}
