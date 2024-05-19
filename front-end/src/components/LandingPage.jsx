import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import CollegeList from './collegeBox/CollegeList';

const LandingPage = () => {
    const { isAuthenticated, user, userLogout } = useAuth(); // Destructure the user from useAuth
    const navigate = useNavigate(); 
    const [ collegeData, setCollegeData] = useState([]);

    // const collegeData = [
    //     { collegeName: 'College A', picURL: 'URL_A' },
    //     { collegeName: 'College B', picURL: 'URL_B' },
    //     { collegeName: "usc", picURL: "URL_C"}
    //     // Add more college data as needed
    // ];

    const handleUserLogOut = () => {
        userLogout()
    }

    useEffect(()=>{
        fetchCollegeBasics();
    }, [])

    const fetchCollegeBasics = () => {
        axios.get("http://localhost:8000/college/getAll")
            .then(response => {
                setCollegeData(response.data)
                // console.log(response.data)
            })
            .catch(error => console.error('Error fetching users:', error));
    }


    return (
        <div className="container mt-5">
            <h1>College Recommender</h1>

            <div className="my-3">
                <Link to="/user/profile" className="btn btn-success me-2">User Profile</Link>
                <Link to="/user/notices" className="btn btn-success me-2">User Notice</Link>
                <Link to="/user/likedColleges" className='btn btn-success me-2'>Liked/Saved Colleges</Link>
                { user && (
                    <Link to="/login" className="btn" onClick={handleUserLogOut}>
                        logout
                    </Link>
                ) }
            </div>

            {/* Check if user is authenticated before rendering */}
            {isAuthenticated && (
                <div className="mb-3">
                    <p>Welcome, {user.username}!</p>
                </div>
            )}

            <div className="mb-3">
                <input type="text" className="form-control" placeholder="Search..." />
            </div>

            <CollegeList data={collegeData} />
        </div>
    );
}

export default LandingPage;
