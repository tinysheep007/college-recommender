import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import CollegeList from './collegeBox/CollegeList';

const Foryou = () => {

    const { user } = useAuth();
    const [collegeData, setCollegeData] = useState([]);
    let sat = 0;
    let gpa = 0.0;
    useEffect(() => {
        fetchInfo();
    }, []);

    // Get user's info
    const fetchInfo = () => {
        console.log("processing");

        axios.get(`http://localhost:8000/user/academic/${user.idusers}`)
            .then((res) => {
                let results = res.data.results[0];
                sat = results["SAT"];
                gpa = results["GPA"];

                searchByCloest();
            }).catch((err) => {
                console.log(err);
            });
    };

    const searchByCloest = () => {
        // console.log(sat)
        axios.get(`http://localhost:8000/college/search/closest?SAT=${sat}&GPA=${gpa}`)
            .then((res) => {
                setCollegeData(res.data);

                // console.log(res.data)
            }).catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="container mt-5 p-4 bg-light rounded">
            <h1 className="mb-4 text-dark">For You</h1>
            <Link to="/landingPage" className='btn btn-success mb-3'>Back to Landing Page</Link>
            <div className="row">
                <div className="col-12">
                    <CollegeList data={collegeData} />
                </div>
            </div>
        </div>
    );
};

export default Foryou;
