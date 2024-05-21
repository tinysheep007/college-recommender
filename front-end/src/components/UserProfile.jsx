import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const UserProfile = () => {
    const { user, updateUser } = useAuth();
    const [username, setUsername] = useState(user ? user.username : '');
    const [password, setPassword] = useState(user ? user.password : '');

    const handleSave = async (field) => {
        // console.log(user)
        try {
            const updatedUser = {
                ...user,
                [field]: field === 'username' ? username : password
            };
            // Assuming you have an endpoint to update user information
            const response = await axios.put(`http://localhost:8000/user/${user.idusers}`, updatedUser);
            if (response.data.success) {
                alert('User information updated successfully');
                // Update the context with the new user data
                updateUser(updatedUser);
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
                    <Link to="/landingPage" className='btn btn-success me-3'>Landing Page</Link>
                    <Link to="/user/academic" className='btn btn-danger'>Edit Academic Profile</Link>
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


                </div>
            ) : (
                <p>No user</p>
            )}
        </div>
    );
};

export default UserProfile;
