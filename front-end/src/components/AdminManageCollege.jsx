import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const AdminManageCollege = () => {
    const [showModal, setShowModal] = useState(false);
    const [colleges, setColleges] = useState([]);
    const [collegeData, setCollegeData] = useState({
        collegeName: "",
        picURL: "",
        aveSAT: 0,
        aveGPA: 0.0,
        tuition: 0,
        accRate: 0.0,
        ranks: 0,
        idCollegeDetails: 0,
        loc: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchColleges();
    }, []);

    const fetchColleges = () => {
        axios.get("http://localhost:8000/college/getAll")
            .then(response => {
                setColleges(response.data);
            })
            .catch(error => console.error('Error fetching colleges:', error));
    }

    const handleAddCollege = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setCollegeData({
            collegeName: "",
            picURL: "",
            aveSAT: 0,
            aveGPA: 0.0,
            tuition: 0,
            accRate: 0.0,
            ranks: 0,
            idCollegeDetails: 0,
            loc: ""
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCollegeData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleAddCollegeSubmit = () => {
        if (!collegeData.collegeName) {
            alert('College Name cannot be empty');
            return;
        }

        console.log(collegeData)

        // axios.post("http://localhost:8000/college/create", collegeData)
        //     .then(response => {
        //         if (response.status === 201) {
        //             alert('College added successfully');
        //             fetchColleges(); // Refresh college list
        //             setShowModal(false);
        //             setCollegeData({
        //                 collegeName: null,
        //                 picURL: null,
        //                 aveSAT: null,
        //                 aveGPA: null,
        //                 tuition: null,
        //                 accRate: null,
        //                 ranks: null,
        //                 idCollegeDetails: null,
        //                 loc: null
        //             });
        //         }
        //     })
        //     .catch(error => console.log(error));
    }

    return (
        <div className="container mt-5">
            <h1>Manage Colleges</h1>
            <button className="btn btn-primary me-3" onClick={handleAddCollege}>Add College</button>
            <button className="btn btn-primary me-3" onClick={()=>navigate("/admin/Panel")}>Back to Panel</button>
            <div className="row">
                {colleges.map(college => (
                    <div className="col-md-4 mb-3" key={college.idCollege}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{college.collegeName}</h5>
            
                            </div>
                            <div>
                                <button>Edit</button>
                            </div> 
                        </div>
                    </div>
                ))}
            </div>

            <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add New College</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="collegeName" className="form-label">College Name:</label>
                                <input type="text" id="collegeName" className="form-control" name="collegeName" value={collegeData.collegeName} onChange={handleInputChange} />
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="picURL" className="form-label">Image URL:</label>
                                <input type="text" id="picURL" className="form-control" name="picURL" value={collegeData.picURL} onChange={handleInputChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="aveSAT" className="form-label">Average SAT:</label>
                                <input type="number" id="aveSAT" className="form-control" name="aveSAT" value={collegeData.aveSAT} onChange={handleInputChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="aveGPA" className="form-label">Average GPA:</label>
                                <input type="number" id="aveGPA" className="form-control"  name="aveGPA" value={collegeData.aveGPA} onChange={handleInputChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tuition" className="form-label">Tuition:</label>
                                <input type="number" id="tuition" className="form-control" name="tuition" value={collegeData.tuition} onChange={handleInputChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="accRate" className="form-label">Acceptance Rate:</label>
                                <input type="number" id="accRate" className="form-control"  name="accRate" value={collegeData.accRate} onChange={handleInputChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ranks" className="form-label">Rank:</label>
                                <input type="number" id="ranks" className="form-control" name="ranks" value={collegeData.ranks} onChange={handleInputChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="idCollegeDetails" className="form-label">College Details ID:</label>
                                <input type="number" id="idCollegeDetails" className="form-control" name="idCollegeDetails" value={collegeData.idCollegeDetails} onChange={handleInputChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="loc" className="form-label">Location:</label>
                                <input type="text" id="loc" className="form-control" name="loc" value={collegeData.loc} onChange={handleInputChange}/>
                            </div>




                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleAddCollegeSubmit}>Add College</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`modal-backdrop ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}></div>

            
        </div>
    )
}

export default AdminManageCollege;
