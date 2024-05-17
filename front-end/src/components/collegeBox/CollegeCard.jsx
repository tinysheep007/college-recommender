import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const CollegeCard = ({ name, picURL, location }) => {
    return (
        <div className="card mb-3">
            <img src={picURL} className="card-img-top" alt={name} />
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{location}</p>
            </div>
        </div>
    );
}

export default CollegeCard;
