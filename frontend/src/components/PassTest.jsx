import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function PassTest() {
    const { id } = useParams(); // Получаем параметр ID из URL
    const [test, setTest] = useState(null); // Состояние для хранения данных теста
    const [error, setError] = useState(null); // Состояние для отображения ошибки

    useEffect(() => {
        async function fetchTestById() {
            try {
                const response = await fetch(`http://localhost:5228/api/Test/GetTestById/${id}`); // Отправляем запрос на сервер с ID теста
                if (!response.ok) {
                    throw new Error('Ошибка при получении теста');
                }
                const data = await response.json(); // Получаем данные теста
                setTest(data); // Обновляем состояние с данными теста
            } catch (error) {
                console.error('Произошла ошибка при получении теста:', error);
                setError(error.message); // Устанавливаем ошибку в состояние
            }
        }
        fetchTestById(); // Вызываем функцию получения теста при монтировании компонента
    }, [id]); // Зависимость от ID, чтобы перезапускать запрос при изменении ID

    if (error) {
        return <div>Произошла ошибка: {error}</div>; // Выводим сообщение об ошибке, если она есть
    }

    return (
        <div className="main">
            {test ? (
                <div>
                    <h2>{test.testName}</h2>
                    <p>Автор: {test.createdBy}</p>
                    {/* Вывод остальной информации о тесте */}
                </div>
            ) : (
                <div>Загрузка...</div> // Отображаем сообщение о загрузке, пока данные не загружены
            )}
        </div>
    );
}
