// CollegeList.jsx
import React from 'react';
import CollegeCard from './CollegeCard.jsx';

const CollegeList = ({ data, onDelete, showDeleteButton }) => {
    return (
        <div>
            {data.map(college => (
                <CollegeCard key={college.idCollege} data={college} onDelete={onDelete} showDeleteButton={showDeleteButton} />
            ))}
        </div>
    )
}

export default CollegeList;
