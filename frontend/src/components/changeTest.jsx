import Header from "./Header";
import lupa from "../images/lupa.png";
import { useState } from "react";

export default function ChangeTest() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [isChanging, setIsChanging] = useState(false);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://26.226.166.33:5228/api/Test/SearchAllTests?query=${searchQuery}`);
            if (!response.ok) {
                throw new Error('Ошибка при поиске тестов');
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Произошла ошибка при поиске тестов:', error);
        }
    };

    const handleTestClick = (test) => {
        setSelectedTest(test);
        setIsChanging(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedTest(prevTest => ({
            ...prevTest,
            [name]: value
        }));
    };

    const handleQuestionChange = (questionId, newText) => {
        setSelectedTest(prevTest => ({
            ...prevTest,
            questions: prevTest.questions.map(question => {
                if (question.questionId === questionId) {
                    return { ...question, questionText: newText };
                }
                return question;
            })
        }));
    };

    const handleAnswerChange = (answerId, newText) => {
        setSelectedTest(prevTest => ({
            ...prevTest,
            questions: prevTest.questions.map(question => ({
                ...question,
                answers: question.answers.map(answer => {
                    if (answer.answerId === answerId) {
                        return { ...answer, answerText: newText };
                    }
                    return answer;
                })
            }))
        }));
    };

    const handleCorrectAnswerChange = (answerId) => {
        setSelectedTest(prevTest => ({
            ...prevTest,
            questions: prevTest.questions.map(question => ({
                ...question,
                answers: question.answers.map(answer => {
                    if (answer.answerId === answerId) {
                        return { ...answer, isCorrect: !answer.isCorrect };
                    }
                    return { ...answer, isCorrect: false }; // Устанавливаем остальные ответы как неправильные
                })
            }))
        }));
    };

    const handleUpdateTest = async () => {
        console.log(selectedTest);
        try {
            const response = await fetch(`http://26.226.166.33:5228/api/Test/UpdateTestInfo`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(selectedTest)
            });

            if (!response.ok) {
                throw new Error('Ошибка при обновлении данных теста');
            }

            setIsChanging(false);
            // Handle success response
        } catch (error) {
            console.error('Произошла ошибка при обновлении данных теста:', error);
        }
    };

    return (
        <div className="main">
            <Header />
            <div className="main-section">
                <div className={!isChanging ? '' : 'hidden'}>
                    <div className='search' >
                        <input
                            type="text"
                            className='input-field'
                            placeholder='Поиск тестов'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <img src={lupa} className='lupa' alt="лупа" onClick={handleSearch} />
                    </div>
                    <div className="search-results">
                        {searchResults.map(test => (
                            <div key={test.id} className='test-card' onClick={() => handleTestClick(test)}>
                                <img className='cover-img' src={test.imageUrl} alt="cover image" />
                                <h3>{test.testName}</h3>
                                <p>Описание: {test.description}</p>
                                <p>Теги: {test.tags.length > 3 ? test.tags.slice(0, 3).map(tag => tag.tagText).join(', ') + ' ...' : test.tags.map(tag => tag.tagText).join(', ')}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={isChanging ? '' : 'hidden'}>
                    {selectedTest && (
                        <div className="test-info-change">
                            <h2>Изменение информации о тесте</h2>
                            <div>
                                <img src={selectedTest.imageUrl} alt="cover image" className="cover-img" />
                                <h2>Название</h2>
                                <input className='make-test-input' type="text" name="testName" value={selectedTest.testName} onChange={handleInputChange} />
                                <h2>Описание</h2>
                                <input className='make-test-input' type="text" name="description" value={selectedTest.description} onChange={handleInputChange} />
                                {/* Вывод вопросов и ответов */}
                                {selectedTest.questions && (
                                    <div>
                                        <h2>Вопросы</h2>
                                        {selectedTest.questions.map(question => (
                                            <div key={question.questionId}>
                                                <h3>Вопрос</h3>
                                                <input className='make-test-input' type="text" name={`question_${question.questionId}`} value={question.questionText} onChange={(e) => handleQuestionChange(question.questionId, e.target.value)} />
                                                <h3>Ответы</h3>
                                                {question.answers.map(answer => (
                                                    <div key={answer.answerId}>
                                                        <input className='make-test-input' type="text" name={`answer_${answer.answerId}`} value={answer.answerText} onChange={(e) => handleAnswerChange(answer.answerId, e.target.value)} />
                                                        <button className={`maketest-button ${answer.isCorrect ? 'correct-answer' : 'incorrect-answer'}`} onClick={() => handleCorrectAnswerChange(answer.answerId)}>
                                                            {answer.isCorrect ? "✔" : "❌"}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button onClick={handleUpdateTest}>Сохранить изменения</button>
                            <button onClick={() => setIsChanging(false)}>Отмена</button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
