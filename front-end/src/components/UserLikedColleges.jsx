// UserLikedColleges.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useAuth } from '../context/AuthContext';
import CollegeList from "../components/collegeBox/CollegeList.jsx"

const UserLikedColleges = () => {
    const { user } = useAuth();
    const [curUserID, setCurUserID] = useState(0);
    const [data , setData] = useState([]);

    useEffect(()=> {
        if (user) {
            setCurUserID(user.idusers);
            fetchLikedColleges();
        }
    }, [user])

    const fetchLikedColleges = () => {
        axios.get(`http://localhost:8000/college/userLikedColleges/${user.idusers}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => console.error('Error fetching college details:', error));
    }

    const handleDeleteLikedCollege = (idCollege, iduserlikedcolleges) => {
        // Update state to remove the deleted college
        setData(prevData => prevData.filter(college => college.idCollege !== idCollege));
        // Call backend to delete the liked college
        axios.delete(`http://localhost:8000/college/userLikedColleges/${iduserlikedcolleges}`)
            .then(response => {
                // Handle success
                alert("deleted sccuess!");
                fetchLikedColleges();
                
            })
            .catch(error => console.error('Error deleting college:', error));
    }

    return user ? (
        <div className="container mt-5">
            <div>{user.username}'s Liked/Saved Colleges</div>
            <Link to="/landingPage" className='btn btn-primary mt-3'>Back to Landing Page</Link>
            <div className="mt-3">Current ID: {curUserID}</div>
            <CollegeList data={data} onDelete={handleDeleteLikedCollege} showDeleteButton />
        </div>
    ) : null;
}

export default UserLikedColleges;
