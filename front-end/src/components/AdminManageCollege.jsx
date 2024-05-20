import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const AdminManageCollege = () => {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [colleges, setColleges] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState({
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
    const navigate = useNavigate();
    const defaultPicURL = 'https://media.licdn.com/dms/image/C5612AQGwZZua75e4mQ/article-cover_image-shrink_600_2000/0/1617988953863?e=2147483647&v=beta&t=_YmhcuASKPoQ9QVLS9ee8ODkCFABFj3phhTH96f2t_M';

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
            aveGPA: 1.1,
            tuition: 0,
            accRate: 0.8,
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

    const handleEditChange = (e) => {
        let { name, value } = e.target;
        if (name === "aveSAT" || name === "tuition" || name === "ranks" || name === "idCollegeDetails"){
            value = parseInt(value, 10) 
        } else if(name === "aveGPA" || name === "accRate"){
            value = parseFloat(value)
        }
        setSelectedCollege(prevState => ({
            ...prevState,
            [name]: value
        }));
    }


    const handleAddCollegeSubmit = () => {
        if (!collegeData.collegeName) {
            alert('College Name cannot be empty');
            return;
        }

        const collegeDataIntegers = {
            ...collegeData,
            aveSAT: parseInt(collegeData.aveSAT, 10),
            ranks: parseInt(collegeData.ranks, 10),
            idCollegeDetails: parseInt(collegeData.idCollegeDetails, 10),
            tuition: parseInt(collegeData.tuition, 10),
            aveGPA: parseFloat(collegeData.aveGPA),
            accRate: parseFloat(collegeData.accRate)
            // Add more fields as needed
        };
    
        if (!collegeDataIntegers.collegeName) {
            alert('College Name cannot be empty');
            return;
        }
        // console.log("casted")
        // console.log(collegeDataIntegers);

        axios.post("http://localhost:8000/college/create", collegeData)
            .then(response => {
                if (response.status === 201) {
                    alert('College added successfully');
                    fetchColleges(); // Refresh college list
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

    const handleEditCollege = (college) => {
        setSelectedCollege(college);
        setShowEditModal(true);
        console.log("editing")
        console.log(college)
    }

    const handleCloseEditModal = () =>{
        setSelectedCollege({
            collegeName: "",
            picURL: "",
            aveSAT: 0,
            aveGPA: 1.1,
            tuition: 0,
            accRate: 0.8,
            ranks: 0,
            idCollegeDetails: 0,
            loc: ""
        })
        setShowEditModal(false)
    }

    const handleEditSubmit = () => {
        console.log("here's current change")
        console.log(selectedCollege)

        const { tempid, ...changedData } = selectedCollege;
        
        axios.put(`http://localhost:8000/college/${selectedCollege.idCollege}`, changedData)
            .then((response)=>{
                if (response.data.success){
                    alert("edited!")
                }
                console.log(response)
                fetchColleges()
                setShowEditModal(false)
            }).catch((err)=>{
                console.log(err.response.data.error)
            })
    }

    const handleCollegeDelete = (college) =>{
        // console.log("deleting...")
        // console.log(college.idCollege)

        axios.delete(`http://localhost:8000/college/${college.idCollege}`)
            .then((res)=>{
                if(res.data.success){
                    alert("Deleted!")
                    fetchColleges()
                }
            }).catch((err)=> {
                console.log(err.response.data.error)
            })
    }

    return (
        <div className="container mt-5">
            <h1>Manage Colleges</h1>
            <button className="btn btn-primary me-3" onClick={handleAddCollege}>Add College</button>
            <button className="btn btn-primary me-3" onClick={()=>navigate("/admin/Panel")}>Back to Panel</button>
            <div className="row">
                {colleges.map(college => (
                    <div className="col-md-4 mb-3" key={college.idCollege}>
                        <div className="card h-100">
                            <img src={college.picURL || defaultPicURL} className="card-img-top" alt={college.collegeName} />
                            <div className="card-body">
                                <h5 className="card-title">{college.collegeName}</h5>
                                <button className="btn btn-primary me-3" onClick={() => handleEditCollege(college)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleCollegeDelete(college)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            

            {/* modal for Add College */}
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
                                <label htmlFor="aveSAT" className="form-label">Average SAT: (int)</label>
                                <input type="number" id="aveSAT" className="form-control" name="aveSAT" value={collegeData.aveSAT} onChange={handleInputChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="aveGPA" className="form-label">Average GPA: (float)</label>
                                <input type="number" id="aveGPA" className="form-control"  name="aveGPA" value={collegeData.aveGPA} onChange={handleInputChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tuition" className="form-label">Tuition: (int)</label>
                                <input type="number" id="tuition" className="form-control" name="tuition" value={collegeData.tuition} onChange={handleInputChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="accRate" className="form-label">Acceptance Rate: (float)</label>
                                <input type="number" id="accRate" className="form-control"  name="accRate" value={collegeData.accRate} onChange={handleInputChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ranks" className="form-label">Rank: (int)</label>
                                <input type="number" id="ranks" className="form-control" name="ranks" value={collegeData.ranks} onChange={handleInputChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="idCollegeDetails" className="form-label">College Details ID: (int)</label>
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

            


            {/* modal for Edit College */}
            <div className={`modal ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit College</h5>
                            <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="collegeName" className="form-label">College Name:</label>
                                <input type="text" id="collegeName" className="form-control" name="collegeName" value={selectedCollege.collegeName} onChange={handleEditChange} />
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="picURL" className="form-label">Image URL:</label>
                                <input type="text" id="picURL" className="form-control" name="picURL" value={selectedCollege.picURL} onChange={handleEditChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="aveSAT" className="form-label">Average SAT: (int)</label>
                                <input type="number" id="aveSAT" className="form-control" name="aveSAT" value={selectedCollege.aveSAT} onChange={handleEditChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="aveGPA" className="form-label">Average GPA: (float)</label>
                                <input type="number" id="aveGPA" className="form-control"  name="aveGPA" value={selectedCollege.aveGPA} onChange={handleEditChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tuition" className="form-label">Tuition: (int)</label>
                                <input type="number" id="tuition" className="form-control" name="tuition" value={selectedCollege.tuition} onChange={handleEditChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="accRate" className="form-label">Acceptance Rate: (float)</label>
                                <input type="number" id="accRate" className="form-control"  name="accRate" value={selectedCollege.accRate} onChange={handleEditChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ranks" className="form-label">Rank: (int)</label>
                                <input type="number" id="ranks" className="form-control" name="ranks" value={selectedCollege.ranks} onChange={handleEditChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="idCollegeDetails" className="form-label">College Details ID: (int)</label>
                                <input type="number" id="idCollegeDetails" className="form-control" name="idCollegeDetails" value={selectedCollege.idCollegeDetails} onChange={handleEditChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="loc" className="form-label">Location:</label>
                                <input type="text" id="loc" className="form-control" name="loc" value={selectedCollege.loc} onChange={handleEditChange}/>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleEditSubmit}>Confirm Edit</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`modal-backdrop ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }}></div>
        </div>
    )
}

export default AdminManageCollege;
