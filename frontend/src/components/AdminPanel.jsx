import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from "./Header";

export default function AdminPanel(){
    const [searchUser, setSearchUser] = useState('');

    const handleSearchChange = (event) => {
        setSearchUser(event.target.value);
    };

    return(
        <div className="main">
            <Header/>
            <div className='main-section'>
                <div className="admin-panel">
                    <h2>Панель администратора</h2>
                    <div className="admin-links">
                        <Link className='link-unstyled' to="/admin/change-users"><button>Изменить пользователей</button></Link>
                        <Link className='link-unstyled' to="/admin/change-tests"><button>Изменить тесты</button></Link>
                    </div>
                </div>
            </div>
            
        </div>
    );
}
