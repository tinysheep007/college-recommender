import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.js';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Comment from '../comment/Comment.jsx';

const CollegeDetail = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const [college, setCollege] = useState(null);
    const [idusers, setIdUsers] = useState(0);

    useEffect(() => {
        fetchCollegeDetails();
        setIdUsers(user.idusers);
    }, []);

    const fetchCollegeDetails = () => {
        axios.get(`http://localhost:8000/college/${id}`)
            .then(response => {
                setCollege(response.data);
                if (response.data.idCollege) {
                    axios.get(`http://localhost:8000/college/collegeinfo/${response.data.idCollege}`)
                        .then(infoResponse => {
                            if (infoResponse.data) {
                                setCollege(prevCollege => ({
                                    ...prevCollege,
                                    collegeInfo: infoResponse.data
                                }));
                            } else {
                                setCollege(prevCollege => ({
                                    ...prevCollege,
                                    collegeInfo: null
                                }));
                            }
                        })
                        .catch(error => console.log(error));
                } else {
                    setCollege(prevCollege => ({
                        ...prevCollege,
                        collegeInfo: null
                    }));
                }
            })
            .catch(error => console.log(error));
    };

    const likeNewCollege = () => {
        axios.put(`http://localhost:8000/college/userLikedColleges/${idusers}/${college.idCollege}`)
            .then(response => {
                if (response.data.success) {
                    alert("One new college saved!");
                } else {
                    console.log("error");
                }
            })
            .catch(err => {
                alert(`Error liking college: ${err.response.data.error}`);
            });
    };

    return (
        <div className="container mt-5">
            <div className="mb-3">
                <Link to="/landingPage" className="btn btn-success me-2">Back to Landing Page</Link>
                <button className="btn btn-primary" onClick={likeNewCollege}>Like</button>
            </div>
            {college ? (
                <div>
                    <h1 className="mb-4">{college.collegeName}</h1>
                    <img src={college.picURL} alt={college.collegeName} className="img-fluid mb-3" style={{ maxHeight: '400px', objectFit: 'cover' }} />
                    <div className="mb-3">
                        <p><strong>Average SAT:</strong> {college.aveSAT}</p>
                        <p><strong>Average GPA:</strong> {college.aveGPA}</p>
                        <p><strong>Tuition:</strong> {college.tuition}</p>
                        <p><strong>Acceptance Rate:</strong> {college.accRate}</p>
                        <p><strong>Rank:</strong> {college.ranks}</p>
                    </div>
                    {college.collegeInfo ? (
                        <div>
                            <h3>College Info:</h3>
                            <div className="mb-3">
                                <p><strong>Life:</strong> {college.collegeInfo.life}</p>
                                <p><strong>Academic:</strong> {college.collegeInfo.academic}</p>
                                <p><strong>Value:</strong> {college.collegeInfo.value}</p>
                                <p><strong>Safety:</strong> {college.collegeInfo.safety}</p>
                                <p><strong>Location:</strong> {college.collegeInfo.location}</p>
                                <p><strong>Athletics:</strong> {college.collegeInfo.athletics}</p>
                            </div>
                        </div>
                    ) : (
                        <p>No details available</p>
                    )}

                    <Comment idCollege={id}/>
                </div>
            ) : (
                <p>Loading college details...</p>
            )}

            
        </div>
    );
    
};

export default CollegeDetail;
