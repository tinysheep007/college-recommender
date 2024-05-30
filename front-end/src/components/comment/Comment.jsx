import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useAuth } from '../../context/AuthContext.js';
import CommentList from './CommentList.jsx';

const Comment = ({ idCollege }) => {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        fetchAllComments();
    }, []);

    // Fetch all comments about this college
    const fetchAllComments = () => {
        axios.get(`http://localhost:8000/college/collegecomment/${idCollege}`)
            .then((res) => {
                // console.log(res.data);
                setData(res.data);
            }).catch((err) => {
                console.log(err);
            });
    };

    const handleSubmit = () => {
        let id = user.idusers;
        const obj = {
            idCollege,
            idusers: id,
            message: input
        };

        axios.post("http://localhost:8000/college/collegecomment/create", obj)
            .then((res) => {
                alert("Posted!");
                fetchAllComments();
            }).catch((err) => {
                console.log(err);
            });

        setInput("");
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Comment Section</h2>
            <div className="mb-3">
                <strong>Current College ID:</strong> {idCollege}
            </div>
            <div className="mb-4">
                <input 
                    type='text' 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    className="form-control mb-2" 
                    placeholder="Write a comment..."
                />
                <button onClick={handleSubmit} className="btn btn-primary">Comment</button>
            </div>
            <CommentList data={data} fetchComments={fetchAllComments} />
        </div>
    );
}

export default Comment;
