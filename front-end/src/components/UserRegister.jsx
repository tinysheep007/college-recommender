import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import axios from 'axios';

const UserRegister = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        
        // Send registration data to backend
        axios.post('http://localhost:8000/user/register', { username, password })
            .then(response => {
                if (response.data.success) {
                    // Registration successful
                    console.log('User registered successfully');
                    // Optionally, redirect user to login page or perform other actions
                } else {
                    // Registration failed
                    console.error('Failed to register user:', response.data.error);
                    // Optionally, display an error message to the user
                }
            })
            .catch(error => {
                console.errr('Error registering user:', error);
                // Optionally, display an error message to the user
            });
    };

    return (
        <div className="container">
            <h2 className="mt-5">User Registration</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label className="form-label">Username:</label>
                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password:</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
            <div className="mt-3">
                <p>Already have an account?</p>
                <Link to="/login" className="btn btn-success">User Login</Link>
            </div>
        </div>
    );
};

export default UserRegister;
