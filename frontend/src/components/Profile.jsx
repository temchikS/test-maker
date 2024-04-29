import React, { useState, useContext, useEffect } from 'react';
import Header from './Header';
import { UserContext} from '../contexts/userContext';
import { Link } from 'react-router-dom';
import strelka from '../images/strelka.png';

export default function ProfilePage() {
    const [image, setImage] = useState(null);
    const [name,setName] = useState(null);
    const [isRedactind,setRedacting] = useState(false);
    const [tests, setTests] = useState({ makedTests: [], passedTests: [] });
    const [toggleInfoPage,setToggleInfoPage] = useState(false);
    const userInfo = useContext(UserContext);

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setImage(file);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };

    function toggleRedact(){
        setRedacting(!isRedactind);
    };
    function toggleUserInfo(){
        setToggleInfoPage(!toggleInfoPage);
    }
    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch(`http://26.226.166.33:5228/api/User/GetUserTestsData`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    // navigate('/login');
                }
                const data = await response.json();
                setTests(data);
                console.log(data);
            } catch (error) {
                console.error('Произошла ошибка при выполнении запроса:', error);
            }
        }

        fetchUserData();
        
    }, [localStorage.getItem('token')]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!image) {
            console.log('No image selected.');
            return;
        }

        const formData = new FormData();
        formData.append('file', image);

        try {
            const response = await fetch('http://26.226.166.33:5228/api/User/UploadProfilePicture', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
            if (!response.ok) {
                console.error('Failed to upload image.');
                return;
            }
            console.log('Image uploaded successfully.');
            // Дополнительные действия после успешной загрузки изображения
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };
    if (!userInfo) {
        return ; 
    }
    return (
        <div className='main'>
            <h2>Профиль</h2>
            <Header />
            <div className='main-section profile'>
                <div className='user-profile blue-border'>
                    <div className={!isRedactind ? '' : 'hidden'}>
                        <img src={userInfo.profilePicture} width={300} height={300} style={{ borderRadius: '100%' }} alt="" />
                        <p>{userInfo.username}</p>
                        <button onClick={toggleRedact}>Изменить аватарку</button>
                    </div>
                    <div className={isRedactind ? 'change-user-data' : 'hidden'}>
                        <div
                            className="drop-area"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {image ? (
                                <img src={URL.createObjectURL(image)} width={300} height={300} alt="Uploaded" />
                            ) : (
                                <p>Перетащите изображение</p>
                            )}
                        </div>
                        
                        <div style={{width:300,display:'flex',gap:10,flexDirection:'column'}}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <button style={{width:300}} onClick={() => document.querySelector('input[type="file"]').click()}>
                                Выбрать изображение
                            </button>
                            {/* <input style={{width:280, borderRadius:'5px',border:'1px solid black', padding:10}} type="text" placeholder='Имя'/> */}
                            <div style={{display:'flex' ,gap:10}}>
                                <button onClick={handleSubmit} style={{backgroundColor:'rgb(71, 208, 85)'}}>Изменить</button>
                                <button onClick={toggleRedact}>Назад</button>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className='user-info blue-border'>
                    <div className={`user-info-item ${!toggleInfoPage ? '' : 'hidden'}`}>
                        <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',margin:'20px'}}>
                            <img width={20} style={{ cursor:'pointer'}} onClick={toggleUserInfo} src={strelka} alt="" />
                            Созданные тесты
                            <img width={20} style={{ transform: 'rotate(180deg)', cursor:'pointer'}}  onClick={toggleUserInfo} src={strelka} alt="" />
                        </div>
                        <div style={{display:'flex',flexWrap:'wrap',gap:'10px', width:'95%'}}>
                            {tests.makedTests && tests.makedTests.map((test, index) => (
                                <Link className='link-unstyled' to={`/pass-test/${test.testName}/${test.id}`}>
                                    <div className='test-card' key={test.id}>
                                        <img className='cover-img' src={test.imageUrl} alt="cover image" />
                                        <h3>{test.testName}</h3>
                                        <p>Описание: {test.description}</p>
                                        <div>
                                            <p>Теги: {test.tags.length > 3 ? test.tags.slice(0, 3).map(tag => tag.tagText).join(', ') + ' ...' : test.tags.map(tag => tag.tagText).join(', ')}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className={`user-info-item ${toggleInfoPage ? '' : 'hidden'}`}>
                        <div style={{display:'flex',alignItems:'center',margin:'20px'}}>
                            <img width={20} style={{ cursor:'pointer'}} onClick={toggleUserInfo} src={strelka} alt="" />
                            Пройденные тесты
                            <img width={20} style={{ transform: 'rotate(180deg)', cursor:'pointer'}}  onClick={toggleUserInfo} src={strelka} alt="" />
                        </div>
                        <div style={{display:'flex',gap:'10px', width:'95%'}}>
                            {tests.passedTests && tests.passedTests.map((test, index) => (
                            <Link className='link-unstyled' to={`/pass-test/${test.testName}/${test.id}`}>
                                <div className='test-card' key={test.id}>
                                    <img className='cover-img' src={test.imageUrl} alt="cover image" />
                                    <h3>{test.testName}</h3>
                                    <p>Описание: {test.description}</p>
                                    <div>
                                        <p>Теги: {test.tags.length > 3 ? test.tags.slice(0, 3).map(tag => tag.tagText).join(', ') + ' ...' : test.tags.map(tag => tag.tagText).join(', ')}</p>
                                    </div>
                                </div>
                            </Link>
                            ))}
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}
