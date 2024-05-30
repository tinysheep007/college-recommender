import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const UserNotice = () => {
    const [notices, setNotices] = useState([]); // Initialize as an empty array

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = () => {
        axios.get('http://localhost:8000/notice/getAll')
            .then(response => {
                // console.log(response.data);
                setNotices(response.data);
            })
            .catch(error => console.error('Error fetching notices:', error));
    };

    return (
        <div className="container">
            <h1>User Notices</h1>
            <div>
                <Link to="/landingPage" className="btn btn-success mb-3">Back to Landing Page</Link>
            </div>
            {notices.length > 0 ? (
                notices.map((data, index) => (
                    <div key={index} className="mb-3 p-3 border rounded">
                        <h5>{data.title}</h5>
                        <p><strong>Date:</strong> {data.date}</p>
                        <p><strong>Content:</strong> {data.content}</p>
                    </div>
                ))
            ) : (
                <p>No notices available.</p>
            )}
        </div>
    );
};

export default UserNotice;
