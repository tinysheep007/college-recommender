import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const AdminPanel = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users data from backend upon component mount
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        // Fetch users data from backend API using Axios
        axios.get('/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));
    };

    const deleteUser = (id) => {
        // Delete user from backend API using Axios
        axios.delete(`/users/${id}`)
            .then(response => {
                if (response.status === 200) {
                    // Refresh users list after successful deletion
                    fetchUsers();
                }
            })
            .catch(error => console.error('Error deleting user:', error));
    };

    return (
        <div className="container">
            <h2 className="mt-5">Admin Panel</h2>
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <button className="btn btn-primary me-2">Edit</button>
                                <button className="btn btn-danger" onClick={() => deleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
