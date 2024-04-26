import React, { useState } from 'react';
import Header from './Header';

export default function ProfilePage() {
    const [image, setImage] = useState(null);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!image) {
            console.log('No image selected.');
            return;
        }

        const formData = new FormData();
        formData.append('file', image);

        try {
            const response = await fetch('http://localhost:5228/api/User/UploadProfilePicture', {
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

    return (
        <div className='main'>
            <h2>Профиль</h2>
            <Header />
            <div className='main-section'>
                <div className='change-picture'>
                    <form onSubmit={handleSubmit}>
                        <div
                            className="drop-area"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {image ? (
                                <img src={URL.createObjectURL(image)} width={200} height={200} alt="Uploaded" />
                            ) : (
                                <p>Перетащите изображение</p>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <button type="button" onClick={() => document.querySelector('input[type="file"]').click()}>
                            Выбрать изображение
                        </button>
                        <button type="submit">Изменить аватар</button>
                    </form>   
                </div>
            </div>
        </div>
    );
}
