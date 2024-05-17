import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const UserProfile = () => {
    const { user } = useAuth();
    const [username, setUsername] = useState(user ? user.username : '');
    const [password, setPassword] = useState(user ? user.password : '');
    const [SAT, setSAT] = useState(1200);
    const [GPA, setGPA] = useState(3.5);
    const [extra, setExtra] = useState("music, marching band");

    const handleSave = async (field) => {
        try {
            const updatedUser = {
                ...user,
                [field]: field === 'username' ? username : password
            };
            // Assuming you have an endpoint to update user information
            const response = await axios.put(`http://localhost:8000/user/${user.id}`, updatedUser);
            if (response.data.success) {
                alert('User information updated successfully');
                // Optionally update the context or local state here
            } else {
                console.error('Failed to update user information:', response.data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="container mt-5">
            {user ? (
                <div>
                    <h2>User Profile</h2>
                    <Link to="/landingPage" className='btn btn-success'>Landing Page</Link>
                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label">Username:</label>
                        <div className="col-sm-8">
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-2">
                            <button
                                className="btn btn-primary"
                                onClick={() => handleSave('username')}
                            >
                                Save
                            </button>
                        </div>
                    </div>


                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label">Password:</label>
                        <div className="col-sm-8">
                            <input
                                type="text"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-2">
                            <button
                                className="btn btn-primary"
                                onClick={() => handleSave('password')}
                            >
                                Save
                            </button>
                        </div>
                    </div>


                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label">SAT:</label>
                        <div className="col-sm-8">
                            <input
                                type="text"
                                className="form-control"
                                value={SAT}
                                onChange={(e) => setSAT(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-2">
                            <button
                                className="btn btn-primary"
                                onClick={() => handleSave('password')}
                            >
                                Save
                            </button>
                        </div>
                    </div>


                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label">GPA:</label>
                        <div className="col-sm-8">
                            <input
                                type="number"
                                className="form-control"
                                value={GPA}
                                onChange={(e) => setGPA(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-2">
                            <button
                                className="btn btn-primary"
                                onClick={() => handleSave('password')}
                            >
                                Save
                            </button>
                        </div>
                    </div>


                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label">Extra:</label>
                        <div className="col-sm-8">
                            <input
                                type="text"
                                className="form-control"
                                value={extra}
                                onChange={(e) => setExtra(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-2">
                            <button
                                className="btn btn-primary"
                                onClick={() => handleSave('password')}
                            >
                                Save
                            </button>
                        </div>
                    </div>


                </div>
            ) : (
                <p>No user</p>
            )}
        </div>
    );
};

export default UserProfile;
