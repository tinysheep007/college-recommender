import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useAuth } from '../../context/AuthContext.js';
import axios from 'axios';

const CommentCard = ({ data, fetchComments }) => {
    const { idusers, idCollege, message, idcollegecomments } = data;
    const { user } = useAuth();
    const [showDelete, setShowDelete] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newMessage, setNewMessage] = useState(message);

    useEffect(() => {
        if (user.idusers === idusers) {
            setShowDelete(true);
        }
    }, [user.idusers, idusers]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/college/collegecomment/${idcollegecomments}`);
            fetchComments(); // Refetch comments after deletion
            alert("delete!")
            
        } catch (error) {
            alert(error.response.data)
            console.log(idcollegecomments)
            console.error('Error deleting comment:', error.response.data);
        }
    };

    const handleEdit = async () => {
        try {
            await axios.put(`http://localhost:8000/college/collegecomment/${idcollegecomments}`, { message: newMessage });
            setIsEditing(false);
            fetchComments(); // Refetch comments after editing
            alert("edited!")
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    return (
        <div className='card mb-3'>
            <div className='card-body'>
                <h5 className='card-title'>User: {idusers}</h5>
                {isEditing ? (
                    <textarea
                        className='form-control mb-2'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                ) : (
                    <p className='card-text'>{message}</p>
                )}
            </div>
            {showDelete && (
                <div className='card-footer'>
                    {isEditing ? (
                        <div>
                            <button className='btn btn-success me-2' onClick={handleEdit}>Save</button>
                            <button className='btn btn-secondary' onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <button className='btn btn-danger me-2' onClick={handleDelete}>Delete</button>
                            <button className='btn btn-primary' onClick={() => setIsEditing(true)}>Edit</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentCard;
