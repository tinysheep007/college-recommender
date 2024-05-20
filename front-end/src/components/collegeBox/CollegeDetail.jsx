import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.js';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const CollegeDetail = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const [college, setCollege] = useState(null);
    const [ idusers, setIdUsers ] = useState(0);

    useEffect(() => {
        fetchCollegeDetails();
        setIdUsers(user.idusers)
    }, []);

    const fetchCollegeDetails = () => {
        axios.get(`http://localhost:8000/college/${id}`)
            .then(response => {
                setCollege(response.data);
            })
            .catch(error => console.loh(error));
    };

    

    const likeNewCollege = () => {
        // console.log(idusers)
        // console.log(college.idCollege)
        axios.put(`http://localhost:8000/college/userLikedColleges/${idusers}/${college.idCollege}`)
            .then((response)=>{
                if (response.data.success){
                    alert("one new colleged saved!");
                }
                else{
                    console.log("error")
                }
            }).catch((err)=>{
                // console.log('Error liking college:');
                alert(`Error liking college: ${err.response.data.error}`);
            })
    }

    return (
        <div className="container mt-5">
            <Link to="/landingPage" className="btn btn-success">Back to Landing Page</Link>
            <button className='btn' onClick={likeNewCollege}>Like</button>
            {college ? (
                <div>
                    <h1>{college.collegeName}</h1>
                    <img src={college.picURL} alt={college.collegeName} className="img-fluid mb-3" style={{ maxHeight: '400px', objectFit: 'cover' }} />
                    <p><strong>Average SAT:</strong> {college.aveSAT}</p>
                    <p><strong>Average GPA:</strong> {college.aveGPA}</p>
                    <p><strong>Tuition:</strong> {college.tuition}</p>
                    <p><strong>Acceptance Rate:</strong> {college.accRate}</p>
                    <p><strong>Rank:</strong> {college.ranks}</p>
                    {/* Add more details as needed */}
                </div>
            ) : (
                <p>Loading college details...</p>
            )}
        </div>
    );
};

export default CollegeDetail;
