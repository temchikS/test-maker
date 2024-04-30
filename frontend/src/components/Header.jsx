import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext} from '../contexts/userContext';
import krestik from '../images/krestik.png';
import lupa from "../images/lupa.png";
import logo from "../images/logo.png";
export default function Header(){
    const userInfo = useContext(UserContext);
    const [showSidebar, setShowSidebar] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSearch = () => {
        navigate(`/all-tests/${searchQuery}`);
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
                <img src={logo} alt="logo" />
                
            </div>
            
            <div className='mini-profile'>
                <div className='search'>
                <input
                        type="text"
                        className='input-field'
                        placeholder='Поиск тестов..'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <img src={lupa} className='lupa' alt="лупа" onClick={handleSearch} />
                </div>
                <p>{userInfo && userInfo.username}</p>
                <img onClick={toggleSideBar} className='user-avatar' src={userInfo.profilePicture} alt="avatar" />
            </div>
            <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
                <img className='close-button' onClick={toggleSideBar} src={krestik} alt="close button" />

                <div className='sidebar-cont'>
                    <h1>Меню</h1>
                    <div className='menu'>
                        <ul>
                            <li><Link className="link-unstyled" to="/">Главная</Link> </li>
                            <li><Link className="link-unstyled" to={'/profile'}>Профиль</Link></li>
                            {userInfo.userRole === 'admin' && <li><Link className="link-unstyled" to={'/not-verified-tests'}>Проверить тесты</Link></li>}
                            {userInfo.userRole === 'admin' && <li><Link className="link-unstyled" to={'/admin-panel'}>Админ панель</Link></li>}
                            <li><Link className="link-unstyled" to={'/maketest'}>Создать тест</Link></li>
                            
                        </ul>
                    </div>
                    <button className='red-button' onClick={handleLogout}>Выйти</button>
                </div>
                
            </div>
        </div>
    );
}