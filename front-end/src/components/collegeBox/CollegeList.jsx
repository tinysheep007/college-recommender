import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import CollegeCard from './CollegeCard.jsx';

const CollegeList = ({ data }) => {

    return (
        <div>
            {data.map(college => (
                < CollegeCard key={college.name} name={college.name} picURL={college.picURL} />
            ))}
        </div>
    )
}

export default CollegeList;
