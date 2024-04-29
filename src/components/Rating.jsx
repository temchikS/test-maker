import React, { useState } from 'react';
import goldZvezda from '../images/goldZvezda.png';
import grayZvezda from '../images/grayZvezda.png';

const RatingStars = ({ testId }) => {
    const [ratingValue, setRatingValue] = useState(null);
    const [isRatingSelected, setIsRatingSelected] = useState(false);

    const handleStarEnter = (ratingValue) => {
        setRatingValue(Math.floor(ratingValue));
        setIsRatingSelected(true);
    };

    const handleEstimate = async () => {
        try {
            const response = await fetch(`http://26.226.166.33:5228/api/Test/RateTest/${testId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify( ratingValue )
            });

            if (!response.ok) {
                throw new Error('Failed to rate test');
            }
            console.log('Test rated successfully');
        } catch (error) {
            console.error('Error rating test:', error.message);
        }
    };

    return (
        <div className="stars-cont">
            <div>
                 {[1, 2, 3, 4, 5].map((index) => {
                let starImage;
                if (index <= ratingValue) {
                    starImage = goldZvezda;
                } else {
                    starImage = grayZvezda;
                }
                return (
                    <img
                        className='star'
                        key={index}
                        style={{ cursor: 'pointer' }}
                        src={starImage}
                        alt="star"
                        onMouseEnter={() => handleStarEnter(index)}
                        onClick={handleEstimate}
                    />
                );
            })}
            </div>
           
            {/* <button onClick={handleEstimate} disabled={!isRatingSelected}>Оценить тест</button> */}
        </div>
    );
};
export default RatingStars;