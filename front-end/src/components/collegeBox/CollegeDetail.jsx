import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const CollegeDetail = () => {
    const { id } = useParams();
    const [college, setCollege] = useState(null);

    useEffect(() => {
        fetchCollegeDetails();
    }, []);

    const fetchCollegeDetails = () => {
        axios.get(`http://localhost:8000/college/${id}`)
            .then(response => {
                setCollege(response.data);
            })
            .catch(error => console.error('Error fetching college details:', error));
    };

    return (
        <div className="container mt-5">
            <Link to="/landingPage" className="btn btn-success">Back to Landing Page</Link>
            <button className='btn'>Like</button>
            {college ? (
                <div>
                    <h1>{college.collegeName}</h1>
                    <img src={college.picURL} alt={college.collegeName} className="img-fluid mb-3" style={{ maxHeight: '400px', objectFit: 'cover' }} />
                    <p><strong>Average SAT:</strong> {college.aveSAT}</p>
                    <p><strong>Average GPA:</strong> {college.aveGPA}</p>
                    <p><strong>Tuition:</strong> {college.aveTuitionPerYr}</p>
                    <p><strong>Acceptance Rate:</strong> {college.accRate}</p>
                    <p><strong>Rank:</strong> {college.rankUSNEWS}</p>
                    {/* Add more details as needed */}
                </div>
            ) : (
                <p>Loading college details...</p>
            )}
        </div>
    );
};

export default CollegeDetail;
