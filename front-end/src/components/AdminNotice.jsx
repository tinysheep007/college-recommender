import React, { useState, useEffect } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const AdminNotice = () => {
    const navigate = useNavigate(); 
    const { admin } = useAuth();
    
    const [notices, setNotices] = useState([]); // Initialize as an empty array
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [currentNotice, setCurrentNotice] = useState(null);
    const [newContent, setNewContent] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState('');

    useEffect(() => {
        fetchNotice();
    }, []);

    const fetchNotice = () => {
        axios.get('http://localhost:8000/notice/getAll')
            .then(response => {
                console.log(response.data);
                setNotices(response.data);
            })
            .catch(error => console.error('Error fetching notices:', error));
    }

    const handleEditClick = (notice) => {
        setCurrentNotice(notice);
        setNewContent(notice.content);
        setShowEditModal(true);
    };

    const handleEditClose = () => {
        setShowEditModal(false);
        setCurrentNotice(null);
        setNewContent('');
    };

    const handleEditSave = () => {
        axios.put(`http://localhost:8000/notice/updateNotice/${currentNotice.idnotice}`, {
            ...currentNotice,
            content: newContent
        })
        .then(response => {
            fetchNotice(); // Refresh the notices after updating
            handleEditClose();
        })
        .catch(error => console.error('Error updating notice:', error));
    };

    const handleCreateClick = () => {
        setNewTitle('');
        setNewDate('');
        setNewContent('');
        setShowCreateModal(true);
    };

    const handleCreateClose = () => {
        setShowCreateModal(false);
        setNewTitle('');
        setNewDate('');
        setNewContent('');
    };

    const handleCreateSave = () => {
        axios.post('http://localhost:8000/notice/addNotice', {
            title: newTitle,
            date: newDate,
            content: newContent,
            idadmin: admin.idadmin // Replace with actual admin ID
        })
        .then(response => {
            fetchNotice(); // Refresh the notices after creating
            handleCreateClose();
        })
        .catch(error => console.error('Error creating notice:', error));
    };

    const handleDeleteClick = (id) => {
        axios.delete(`http://localhost:8000/notice/deleteNotice/${id}`)
            .then(response => {
                fetchNotice(); // Refresh the notices after deleting
            })
            .catch(error => console.error('Error deleting notice:', error));
    };

    const handleBack = () => {
        navigate("/admin/Panel")
    }

    return (
        <div className="container">
            <h1>Admin Notice Page</h1>
            <button className="btn btn-success me-3" onClick={handleCreateClick}>Create Notice</button>
            <button className="btn btn-success me-3" onClick={handleBack}>Back to Panel</button>
            {notices.length > 0 ? (
                notices.map((data, index) => (
                    <div key={index} className="mb-3 p-3 border rounded">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{data.title}</h5>
                                <p><strong>Date:</strong> {data.date}</p>
                                <p><strong>Content:</strong> {data.content}</p>
                            </div>
                            <div>
                                <button className="btn btn-primary me-2" onClick={() => handleEditClick(data)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDeleteClick(data.idnotice)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No notices available.</p>
            )}

            {/* Edit Notice Modal */}
            {showEditModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Notice</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleEditClose}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <div className="form-label">{currentNotice.title}</div>
                                    <label htmlFor="noticeContent" className="form-label">Content</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="noticeContent"
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleEditClose}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleEditSave}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Notice Modal */}
            {showCreateModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create Notice</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleCreateClose}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="noticeTitle" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="noticeTitle"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="noticeDate" className="form-label">Date</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="noticeDate"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="noticeContent" className="form-label">Content</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="noticeContent"
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCreateClose}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleCreateSave}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal backdrop */}
            {(showEditModal || showCreateModal) && <div className="modal-backdrop show"></div>}
        </div>
    );
}

export default AdminNotice;
