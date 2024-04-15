import React from 'react';
import { Link } from 'react-router-dom';
import './profile.css';

function Profile() {
    return (
        <div className='Profile'>
            <div className='butup'>
                <Link to="/welcome" className="butup">
                    <h1>Назад</h1>
                </Link>
            </div>
        </div>
    );
}

export default Profile;