import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminManageSuggest = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = () => {
        axios.get('http://localhost:8000/user/suggest')
            .then(response => {
                setSuggestions(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching suggestions:', error);
                setError('Failed to fetch suggestions');
                setLoading(false);
            });
    };

    const handleDelete = (idcollegesuggest) => {
        axios.delete(`http://localhost:8000/user/suggest/${idcollegesuggest}`)
            .then(() => {
                setSuggestions(suggestions.filter(suggestion => suggestion.idcollegesuggest !== idcollegesuggest));
                alert('Delete success');
            })
            .catch(error => {
                console.error('Error deleting suggestion:', error);
                alert('Failed to delete suggestion');
            });
    };

    const handleApprove = async (idcollegesuggest) => {
        try {
            // Get the suggestion details from the suggestions array
            const suggestion = suggestions.find(suggestion => suggestion.idcollegesuggest === idcollegesuggest);
            if (!suggestion) {
                throw new Error('Suggestion not found');
            }
    
            // Add the college to the collegebasics database
            const collegeData = {
                collegeName: suggestion.collegeName,
                picURL: suggestion.picURL,
                aveSAT: suggestion.aveSAT,
                aveGPA: suggestion.aveGPA,
                tuition: suggestion.tuition,
                accRate: suggestion.accRate,
                ranks: suggestion.ranks,
                idusers: suggestion.idusers
                // Add other necessary fields here
            };
    
            await axios.post('http://localhost:8000/college/create', collegeData);
    
            axios.delete(`http://localhost:8000/user/suggest/${idcollegesuggest}`)
            .then(() => {
                setSuggestions(suggestions.filter(suggestion => suggestion.idcollegesuggest !== idcollegesuggest));
                fetchSuggestions();
            })
            .catch(error => {
                console.error('Error deleting suggestion:', error);
                alert('Failed to delete suggestion');
            });
    
            // Alert the user
            alert('Approve success');
        } catch (error) {
            console.error('Error approving suggestion:', error);
            alert('Failed to approve suggestion');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mt-4">
            <h1>Manage Suggested Colleges</h1>
            <Link to="/admin/Panel" className='btn btn-success me-2 mb-3'>Back to Panel</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>College Name</th>
                        <th>Picture</th>
                        <th>Average SAT</th>
                        <th>Average GPA</th>
                        <th>Tuition</th>
                        <th>Acceptance Rate</th>
                        <th>Rank</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {suggestions.map(suggestion => (
                        <tr key={suggestion.idcollegesuggest}>
                            <td>{suggestion.idcollegesuggest}</td>
                            <td>{suggestion.collegeName}</td>
                            <td><img src={suggestion.picURL} alt={suggestion.collegeName} style={{ width: '100px' }} /></td>
                            <td>{suggestion.aveSAT}</td>
                            <td>{suggestion.aveGPA}</td>
                            <td>{suggestion.tuition}</td>
                            <td>{suggestion.accRate}</td>
                            <td>{suggestion.ranks}</td>
                            <td>
                                <button className="btn btn-success me-2" onClick={() => handleApprove(suggestion.idcollegesuggest)}>Approve</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(suggestion.idcollegesuggest)}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminManageSuggest;
