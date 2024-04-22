import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext} from '../contexts/userContext';
import krestik from '../images/krestik.png';
export default function Header(){
    const userInfo = useContext(UserContext);
    const [showSidebar, setShowSidebar] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    function toggleSideBar() {
        setShowSidebar(!showSidebar);
    }
    if (!userInfo) {
        return ; 
    }
    return(
        <div className='HeaderStyle'>
            <div className='mini-profile our-logo'>
                <img src="" alt="logo" />
                <p>название</p>
            </div>
            <div className='mini-profile'>
                <p>{userInfo && userInfo.username}</p>
                <img onClick={toggleSideBar} className='user-avatar' src={userInfo.profilePicture} alt="avatar" />
            </div>
            <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
                <img className='close-button' onClick={toggleSideBar} src={krestik} alt="close button" />
                <h1>Меню</h1>
                <div className='menu'>
                    <ul>
                        <li><Link className="link-unstyled" to="/">Главная</Link> </li>
                        <li><Link className="link-unstyled" to={'/profile'}>Профиль</Link></li>
                        <li>Настройки</li>
                        <li>ЧОТА еще</li>
                        {userInfo.userRole === 'admin' && <li><Link className="link-unstyled" to={'/not-verified-tests'}>Проверить тесты</Link></li>}
                        <li><Link className="link-unstyled" to={'/maketest'}>Создать тест</Link></li>
                        
                    </ul>
                </div>
                <button onClick={handleLogout}>Выйти</button>
            </div>
        </div>
    );
}