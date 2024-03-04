import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom'; // Import Link from React Router
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate(); 
    
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            if (isAdmin) {
                // For admin login
                const response = await axios.post('http://localhost:8000/admin/login', { username, password });
                if (response.data.success) {
                    // Redirect to admin panel upon successful login
                    navigate('/admin/panel');
                } else {
                    // Handle failure
                    console.error('Login failed:', response.data.error);
                }
            } else {
                // For user login
                // Perform login logic here
                console.log(`Logging in as user with username: ${username} and password: ${password}`);
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error
        }
    };
    

    return (
        <div className="container">
            <h2 className="mt-5">Login</h2>
            <form>
                <div className="mb-3">
                    <label className="form-label">Username:</label>
                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password:</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
                    <label className="form-check-label">Login as Admin</label>
                </div>
                <button type="submit" className="btn btn-primary" onClick={(e)=>handleLogin(e)}>Login</button>
            </form>
            
            {/* Add registration links/buttons */}
            <div className="mt-3">
                <p>Don't have an account?</p>
                <Link to="/user/register" className="btn btn-success me-2">User Registration</Link>
                <Link to="/admin/register" className="btn btn-warning">Admin Registration</Link>
            </div>
        </div>
    );
};

export default Login;
