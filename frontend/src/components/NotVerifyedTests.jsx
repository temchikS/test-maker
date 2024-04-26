import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
export default function NotVerTest(){
    const [tests, setTests] = useState([]);
    useEffect(() => {
        async function fetchTests() {
            try {
                const response = await fetch('http://localhost:5228/api/Test/GetNotVerifiedTests');
                if (!response.ok) {
                    throw new Error('Ошибка при получении тестов');
                }
                const data = await response.json();
                console.log(data);
                setTests(data);
            } catch (error) {
                console.error('Произошла ошибка при получении тестов:', error);
            }
        }
        fetchTests();
    }, []);

    return(
        <div>
            <Header/>
            <div className='tests-map'>
                {tests.map(test => (
                <Link className='link-unstyled' key={test.id} to={`/check-test/${test.testName}/${test.id}`}>
                    <div className='test-card'>
                        <img className='cover-img' src={test.imageUrl} alt="cover image" />
                        <h3>{test.testName}</h3>
                        <p>Автор: {test.createdBy}</p>
                        <div>
                            <p>Теги: {test.tags.length > 3 ? test.tags.slice(0, 3).map(tag => tag.tagText).join(', ') + ' ...' : test.tags.map(tag => tag.tagText).join(', ')}</p>
                        </div>
                    </div>
                </Link>
            ))}</div>
        </div>
    );
}