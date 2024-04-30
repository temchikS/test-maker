import Header from "./Header";
import lupa from "../images/lupa.png";
import { useState } from "react";
import defaultPicture from '../images/default.png';
export default function ChangeUser(){
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isChanching,setChanching] = useState(false);
    let defaultProfilePictureUrl = selectedUser ? selectedUser.profilePictureUrl : defaultPicture;


    const handleSearch = async () => {
        try {
            const response = await fetch(`http://26.226.166.33:5228/api/User/SearchUsers?query=${searchQuery}`);
            if (!response.ok) {
                throw new Error('Ошибка при поиске пользователей');
            }
            const data = await response.json();
            setSearchResults(data);
            console.log(data);
        } catch (error) {
            console.error('Произошла ошибка при поиске пользователей:', error);
        }
    };
    const handleResetProfilePicture = () => {
        setSelectedUser({ ...selectedUser, profilePictureUrl: defaultProfilePictureUrl });
    };
    function toggleChanching(){
        setChanching(!isChanching);
    };
    const handleUserClick = (user) => {
        setSelectedUser(user);
        toggleChanching();
    };
    const updateUser = async () => {
        if (defaultProfilePictureUrl === defaultPicture) {
            selectedUser.profilePictureUrl = "default.png";
        }
        try {
            const userData = {
                UserId: selectedUser.id, // Assuming 'id' is the property containing the user ID
                Username: selectedUser.username,
                Age: selectedUser.age,
                Role: selectedUser.role,
                ProfilePictureUrl: selectedUser.profilePictureUrl
            };
    
            const response = await fetch(`http://26.226.166.33:5228/api/User/UpdateUserInfo`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData)
            });
    
            if (!response.ok) {
                throw new Error('Ошибка при обновлении данных пользователя');
            }
            setChanching(false);
            // Handle success response
    
        } catch (error) {
            console.error('Произошла ошибка при обновлении данных пользователя:', error);
        }
    };
    
    return(
        <div className="main">
            <Header/>
            <div className="main-section">
                <div className={!isChanching ? '' : 'hidden'}>
                    <div className='search' >
                        <input
                            type="text"
                            className='input-field'
                            placeholder='Поиск пользователей'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <img src={lupa} className='lupa' alt="лупа" onClick={handleSearch} />
                    </div>
                    <div className="search-results">
                        {searchResults.map(user => (
                            <div key={user.id} className="mini-user" onClick={() => handleUserClick(user)}>
                                <img src={user.profilePictureUrl} alt="Avatar" className="avatar" />
                                <p>{user.username}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className={isChanching ? '' : 'hidden'}>
                    {selectedUser && (
                    <div className="user-info-change">
                        <h2>Информация о пользователе</h2>
                        <div>
                            <img src={selectedUser.profilePictureUrl} style={{ borderRadius: '100%' }} width={300} height={300} alt="" />
                            <button onClick={handleResetProfilePicture}>Сбросить картинку</button>
                            <input type="text" value={selectedUser.username} onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })} />
                            <input type="number" value={selectedUser.age} min={0} max={100} onChange={(e) => setSelectedUser({ ...selectedUser, age: e.target.value })} />
                            <select value={selectedUser.role} onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}>
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                            </select>
                        </div>
                        <button onClick={updateUser}>Изменить</button>
                        <button onClick={toggleChanching}>Назад</button>
                    </div>
                    )}
                    
                </div>
                
            </div>
        </div>
    );
}
