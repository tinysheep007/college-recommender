import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const UserSuggest = () => {
    const { user } = useAuth();
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [collegeData, setCollegeData] = useState({
        collegeName: "",
        picURL: "",
        aveSAT: 0,
        aveGPA: 1.1,
        tuition: 0,
        accRate: 0.8,
        ranks: 0,
        idCollegeDetails: 0,
        loc: ""
    });

    useEffect(() => {
        fetchUserSuggestions();
    }, []);

    const fetchUserSuggestions = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/user/suggest/user/${user.idusers}`);
            setSuggestions(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user suggestions:', error);
            setError('Failed to fetch user suggestions');
            setLoading(false);
        }
    };

    const handleOpenSuggestions = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleEditChange = (e) => {
        let { name, value } = e.target;
        if (name === "aveSAT" || name === "tuition" || name === "ranks" || name === "idCollegeDetails"){
            value = parseInt(value, 10) 
        } else if(name === "aveGPA" || name === "accRate"){
            value = parseFloat(value)
        }
        setCollegeData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmitAdd = () => {
        const collegeDataIntegers = {
            ...collegeData,
            aveSAT: parseInt(collegeData.aveSAT, 10),
            ranks: parseInt(collegeData.ranks, 10),
            idCollegeDetails: 0,
            tuition: parseInt(collegeData.tuition, 10),
            aveGPA: parseFloat(collegeData.aveGPA),
            accRate: parseFloat(collegeData.accRate)
            // Add more fields as needed
        };
    
        if (!collegeDataIntegers.collegeName) {
            alert('College Name cannot be empty');
            return;
        }
 

        axios.post("http://localhost:8000/college/create", collegeData)
            .then(response => {
                if (response.status === 201) {
                    alert('College added successfully');
                    // fetchColleges(); // Refresh college list
                    setShowModal(false);
                    setCollegeData({
                        collegeName: "",
                        picURL: "",
                        aveSAT: 0,
                        aveGPA: 1.1,
                        tuition: 0,
                        accRate: 0.8,
                        ranks: 0,
                        idCollegeDetails: 0,
                        loc: ""
                    });
                }
            })
            .catch(error => console.log(error.response.data.error));
    }


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>User Suggestions</h1>
            <button className="btn btn-success me-2" onClick={handleOpenSuggestions}>Add new suggestions</button>

            <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add New Suggestion</h5>
                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="collegeName" className="form-label">College Name:</label>
                                <input type="text" id="collegeName" className="form-control" name="collegeName" value={collegeData.collegeName} onChange={handleEditChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="picURL" className="form-label">Image URL:</label>
                                <input type="text" id="picURL" className="form-control" name="picURL" value={collegeData.picURL} onChange={handleEditChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="aveSAT" className="form-label">Average SAT: (int)</label>
                                <input type="number" id="aveSAT" className="form-control" name="aveSAT" value={collegeData.aveSAT} onChange={handleEditChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="aveGPA" className="form-label">Average GPA: (float)</label>
                                <input type="number" id="aveGPA" className="form-control"  name="aveGPA" value={collegeData.aveGPA} onChange={handleEditChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tuition" className="form-label">Tuition: (int)</label>
                                <input type="number" id="tuition" className="form-control" name="tuition" value={collegeData.tuition} onChange={handleEditChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="accRate" className="form-label">Acceptance Rate: (float)</label>
                                <input type="number" id="accRate" className="form-control"  name="accRate" value={collegeData.accRate} onChange={handleEditChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ranks" className="form-label">Rank: (int)</label>
                                <input type="number" id="ranks" className="form-control" name="ranks" value={collegeData.ranks} onChange={handleEditChange}/>
                            </div>
        
                            <div className="mb-3">
                                <label htmlFor="loc" className="form-label">Location:</label>
                                <input type="text" id="loc" className="form-control" name="loc"  onChange={handleEditChange}/>
                        </div>


                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal} >Close</button>
                            <button type="button" className="btn btn-secondary" >Submit</button>
                            {/* Add a button to submit the form here */}
                        </div>
                    </div>
                </div>
            </div>

            <ul>
                {suggestions.map(suggestion => (
                    <li key={suggestion.idcollegesuggest}>
                        <h2>{suggestion.collegeName}</h2>
                        <p>Average SAT: {suggestion.aveSAT}</p>
                        <p>Average GPA: {suggestion.aveGPA}</p>
                        <p>Tuition: {suggestion.tuition}</p>
                        <p>Acceptance Rate: {suggestion.accRate}</p>
                        <p>Rank: {suggestion.ranks}</p>
                        
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserSuggest;
