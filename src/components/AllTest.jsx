import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header';
import ScrollMenu from 'react-scroll-horizontal';

function AllTests({ scrollLeft, scrollRight }) {
    const { searchQuery } = useParams();
    const [error, setError] = useState(null);
    const [tests, setTests] = useState([]);
    const scrollMenuRef = useRef(null);

    useEffect(() => {
        async function fetchTests() {
            try {
                let url = 'http://26.226.166.33:5228/api/Test/GetTests';
                if (searchQuery) {
                    url = `http://26.226.166.33:5228/api/Test/SearchTests?query=${searchQuery}`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Ошибка при получении тестов');
                }
                const data = await response.json();
                setTests(data);
            } catch (error) {
                console.error('Произошла ошибка при получении тестов:', error);
                setError(error.message);
            }
        }
        fetchTests();
    }, [searchQuery]);

    if (error) {
        return <div>Произошла ошибка: {error}</div>;
    }

    return (
        <div className='main'>
            <Header />
            <h2>Все тесты</h2>
            <div className='main-section'>
                <div className='scroll-menu-wrapper'>
                    <ScrollMenu ref={scrollMenuRef}>
                        {tests.map(test => (
                            <Link className='link-unstyled' key={test.id} to={`/pass-test/${test.testName}/${test.id}`}>
                                <div className='test-card'>
                                    <img className='cover-img' src={test.imageUrl} alt="cover image" />
                                    <h3>{test.testName}</h3>
                                    <p>Автор: {test.createdBy}</p>
                                    <div>
                                        <p>Теги: {test.tags.length > 3 ? test.tags.slice(0, 3).map(tag => tag.tagText).join(', ') + ' ...' : test.tags.map(tag => tag.tagText).join(', ')}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </ScrollMenu>
                </div>
            </div>
        </div>
    );
}

export default AllTests;
