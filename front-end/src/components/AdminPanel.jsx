import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Navigate, useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const { admin, adminLogout } = useAuth();

    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [showEditModal, setEditModal] = useState(false);
    const [editUsername, setEditUsername] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editId, setEditId] = useState(0)

    const navigate = useNavigate(); 

    useEffect(() => {
        // Fetch users data from backend upon component mount
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        // Fetch users data from backend API using Axios
        axios.get('http://localhost:8000/user/getAll')
            .then(response => setUsers(response.data))
            .catch(error => console.log('Error fetching users:'));
    };

    const deleteUser = (id) => {
        // Delete user from backend API using Axios
        axios.delete(`http://localhost:8000/user/${id}`)
            .then(response => {
                if (response.status === 200) {
                    // Refresh users list after successful deletion
                    fetchUsers();
                }
            })
            .catch(error => console.error('Error deleting user:', error));
    };

    const handleAddUser = () => {
        // Logic for adding new user
        console.log("Adding new user...");
        // Here you can perform the actual API call to add a new user
        axios.post('http://localhost:8000/user/register', { username, password })
            .then(response => {
                if (response.data.success) {
                    // Registration successful
                    // console.log('User registered successfully');
                    

                    let tempID = response.data.userId;
                    
                    let obj = {
                        idusers: tempID,
                        SAT: 1200,
                        GPA: 3.5,
                        extra: "",
                        others: "",
                        majors: ""
                    };
                    axios.post("http://localhost:8000/user/academic/create", obj)
                        .then((res) => {
                            alert('User registered successfully');
                        }).catch((err) => {
                            console.log(err);
                        });

                    fetchUsers();
                    
                    // Optionally, redirect user to login page or perform other actions
                } else {
                    // Registration failed
                    console.log('Failed to register user:', response.data.error);
                    // Optionally, display an error message to the user
                    alert('Failed to register user:', response.data.error)
                }
            })
            .catch(error => {
                alert('Error registering user:', error);
                // Optionally, display an error message to the user
            });

        // After successful addition, close the modal and refresh users list
        setShowModal(false);
        fetchUsers(); // Example: Refresh user list after adding a new user
    };

    const handleShowEditModal = (id, oldUsername, oldPassword) => {
        setEditModal(true)
        setEditId(id)
        console.log("edited id set to")
        console.log(editId)
        // console.log(id)
        setEditUsername(oldUsername)
        setEditPassword(oldPassword)
    }

    const handleEditUser = (editId, editUsername, editPassword) =>{

        console.log("handling ID")
        console.log(editId)
        axios.put(`http://localhost:8000/user/${editId}`, { username: editUsername, password: editPassword })
            .then(response => {
                if (response.status === 200) {
                    // User updated successfully
                    console.log('User updated successfully');
                    alert('User updated successfully');
                    window.location.reload();
                    // Optionally, refresh users list or perform other actions
                    fetchUsers(); // Example: Refresh user list after updating user data
                }
            })
            .catch(error => {
                console.error('Error updating user:', error);
                // Optionally, display an error message to the user
                alert('Error updating user:', error.message);
            });
    }

    const handleAdminLogout = () => {
        adminLogout()
        navigate("/login")
    }

    const handleAdminNotice = () => {
        navigate("/admin/notices")
    }

    return (
        <div className="container">
            <h2 className="mt-5">Admin Panel</h2>
            <p>Welcome, {admin && admin.username}</p> 
            <button className="btn btn-danger me-3" onClick={handleAdminLogout}>Logout </button>
            <button className="btn btn-danger me-3" onClick={handleAdminNotice}> Manage Notice </button>
            <button className="btn btn-danger me-3" onClick={()=>navigate("/admin/manageCollege")}> Manage Colleges</button>
            <button className="btn btn-success me-3" onClick={() => setShowModal(true)}>Add New User</button>
            <button className="btn btn-success" onClick={()=>navigate("/admin/manageSuggest")}>Manage Users' Suggested Colleges</button>
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.idusers}>
                            <td>{user.username}</td>
                            <td>{user.password}</td>
                            <td>
                                <button className="btn btn-primary me-2" onClick={()=> handleShowEditModal(user.idusers, user.username, user.password)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => deleteUser(user.idusers)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Modal for adding new user */}
            <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add New User</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username:</label>
                                <input type="text" id="username" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password:</label>
                                <input type="password" id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleAddUser}>Add User</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`modal-backdrop ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}></div>
        
            
            <div className={`modal ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }}>
            <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title mt-3">Add New User</h5>
                            <button type="button" className="btn-close" onClick={() => setEditModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username:</label>
                                <input type="text" id="username" className="form-control" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password:</label>
                                <input type="password" id="password" className="form-control" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setEditModal(false)}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={() => handleEditUser(editId, editUsername, editPassword)}>Edit User</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`modal-backdrop ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }}></div>
        
        
        </div>
    );
};

export default AdminPanel;
