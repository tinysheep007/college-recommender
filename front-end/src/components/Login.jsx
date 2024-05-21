import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link from React Router
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate(); 
    const { userLogin, adminLogin } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            if (isAdmin) {
                const response = await axios.post('http://localhost:8000/admin/login', { username, password });
                if (response.data.success) {
                    const { status, error } = await adminLogin(username, password);
                    if (status) navigate('/admin/panel');
                    else alert(error)
                } else {
                    console.error('Admin login failed:', response.data.error);
                }
            } else {
                const {status, error} = await userLogin(username, password);
                if (status) navigate('/landingPage');
                else alert(error + "; incorrect username or password");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("error; incorrct admin username or password")
        }
    };

    return (
        <div className="container">
            <h2 className="mt-5">Login</h2>
            <form onSubmit={handleLogin}>
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
                <button type="submit" className="btn btn-primary me-3">Login</button>
                <Link to="/" className="btn btn-success">Home</Link>
            </form>
            <div className="mt-3">
                <p>Don't have an account?</p>
                <Link to="/user/register" className="btn btn-success me-2">User Registration</Link>
                <Link to="/admin/register" className="btn btn-warning">Admin Registration</Link>
            </div>
        </div>
    );
};

export default Login;
