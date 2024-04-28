import React, { useState } from 'react';
import Header from './Header';

export default function ProfilePage() {
    const [image, setImage] = useState(null);

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

    return (
        <div>
            <Header />
            <h2>Profile Page</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <button type="submit">Upload Image</button>
            </form>
        </div>
    );
}
