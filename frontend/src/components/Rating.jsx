import React, { useState } from 'react';
import goldZvezda from '../images/goldZvezda.png';
import grayZvezda from '../images/grayZvezda.png';
import goldGrayZvezda from '../images/gold-grayZvezda.png';

const RatingStars = ({ userId, userName }) => {
    const [ratingValue, setRatingValue] = useState();

    const handleStarEnter = (ratingValue) => {
        setRatingValue(Math.floor(ratingValue));
    };


    const handleEstimate = () => {
        console.log(ratingValue,userId,userName);
    };
    return (
        <div className="stars-cont">
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
            <button onClick={handleEstimate}>Оценить тест</button>
        </div>
    );
};

export default RatingStars;
