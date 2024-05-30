import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.js';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Comment from '../comment/Comment.jsx';
import DecisionsChart from './DecisionsChart.jsx';

const CollegeDetail = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const [college, setCollege] = useState(null);
    const [idusers, setIdUsers] = useState(0);
    const [SAT, setSAT] = useState(0);
    const [GPA, setGPA] = useState(3.0);
    const [decision, setDecision] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setIdUsers(user.idusers);
            fetchCollegeDetails();
        } else {
            setLoading(true);
        }
    }, [user]);

    const fetchCollegeDetails = () => {
        axios.get(`http://localhost:8000/college/${id}`)
            .then(response => {
                setCollege(response.data);
                if (response.data.idCollege) {
                    axios.get(`http://localhost:8000/college/collegeinfo/${response.data.idCollege}`)
                        .then(infoResponse => {
                            setCollege(prevCollege => ({
                                ...prevCollege,
                                collegeInfo: infoResponse.data || null
                            }));
                            setLoading(false);
                        })
                        .catch(error => {
                            console.log(error);
                            setLoading(false);
                        });
                } else {
                    setCollege(prevCollege => ({
                        ...prevCollege,
                        collegeInfo: null
                    }));
                    setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
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

    const handleSubmitDecision = () => {
        const obj = {
            idusers: user.idusers,
            idCollege: parseInt(id, 10),
            SAT,
            GPA,
            decision
        };
        console.log(obj);

        axios.post("http://localhost:8000/college/collegedecision", obj)
            .then((res) => {
                alert("added new decision");
                window.location.reload();
            }).catch((err) => {
                console.log(err);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

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
                    <DecisionsChart idCollege={id} />

                    {/* submit new decision */}
                    <div className="container mt-5">
                        <div className="card">
                            <div className="card-body">
                                <div>
                                    <div>
                                        <label htmlFor="SAT">SAT </label>
                                        <input type="number" id="SAT" className="form-control" name="SAT" value={SAT} onChange={(e) => setSAT(e.target.value)} />
                                    </div>

                                    <div>
                                        <label htmlFor="GPA">GPA </label>
                                        <input type="number" id="GPA" className="form-control" name="GPA" value={GPA} onChange={(e) => setGPA(e.target.value)} />
                                    </div>

                                    <div>
                                        <label htmlFor="decision">Decision - (accepted / rejected / waitlisted)</label>
                                        <input type="text" id="decision" className="form-control" name="decision" value={decision} onChange={(e) => setDecision(e.target.value)} />
                                    </div>

                                    <button className="btn btn-primary btn-block" onClick={handleSubmitDecision}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Comment idCollege={id} />

                </div>
            ) : (
                <p>Loading college details...</p>
            )}
        </div>
    );

};

export default CollegeDetail;
