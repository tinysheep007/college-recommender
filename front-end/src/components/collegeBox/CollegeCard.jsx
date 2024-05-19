import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const CollegeCard = ({ data, onDelete, showDeleteButton }) => {
    const { idCollege, collegeName, picURL, loc, iduserlikedcolleges } = data;

    // Default image URL
    const defaultPicURL = 'https://media.licdn.com/dms/image/C5612AQGwZZua75e4mQ/article-cover_image-shrink_600_2000/0/1617988953863?e=2147483647&v=beta&t=_YmhcuASKPoQ9QVLS9ee8ODkCFABFj3phhTH96f2t_M';

    const handleDeleteLikedCollege = () => {
        onDelete(idCollege, iduserlikedcolleges); // Call the delete function passed from the parent
    }

    return (
        <div className="card mb-3">
            <Link to={`/college/${idCollege}`} className="text-decoration-none text-dark">
                <div className="position-relative">
                    <img 
                        src={picURL || defaultPicURL} // Use picURL if available, otherwise use defaultPicURL
                        className="card-img-top" 
                        alt={collegeName} 
                        style={{ maxHeight: '300px', objectFit: 'cover' }} 
                    />
                    <div className="card-img-overlay d-flex flex-column justify-content-end p-2">
                        <h5 className="card-title text-white mb-1 bg-dark bg-opacity-75 p-4 rounded">
                            {collegeName}
                        </h5>
                        <p className="card-text text-white bg-dark bg-opacity-75 p-1 rounded">
                            Location: {loc}
                        </p>
                    </div>
                </div>
            </Link>
            {showDeleteButton && (
                <button className="btn btn-danger mt-2" onClick={handleDeleteLikedCollege}>
                    Delete
                </button>
            )}
        </div>
    );
}

export default CollegeCard;
