import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch('http://localhost:5228/api/User/GetUserData', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    navigate('/login');
                    // throw new Error('Unauthorized');
                }
                const data = await response.json();
                // console.log(data);
                setUserInfo(data);
            } catch (error) {
                console.error('Произошла ошибка при выполнении запроса:', error);
            }
        }

        fetchUserData();
        
    }, [localStorage.getItem('token')]);

    return (
        <UserContext.Provider value={userInfo}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
