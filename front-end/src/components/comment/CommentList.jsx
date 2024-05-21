import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import CommentCard from './CommentCard';

const CommentList = ({ data, fetchComments }) =>{
    return (
        <div>
            {data.map(comment => (
                <CommentCard fetchComments={fetchComments} key={comment.idcollegecomments} data={comment} />
            ))}
        </div>
    )
}

export default CommentList;