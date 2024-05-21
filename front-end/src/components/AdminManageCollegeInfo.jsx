import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const AdminManageCollegeInfo = () => {
    const [collegeInfo, setCollegeInfo] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false); // State for Add Info modal
    const [newCollegeInfo, setNewCollegeInfo] = useState({
        academic: '',
        value: '',
        safety: '',
        location: '',
        athletics: '',
        life: '',
        idCollege: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchCollegeInfo();
    }, []);

    const fetchCollegeInfo = async () => {
        try {
            // Fetch college info from collegeinfo table
            const collegeInfoResponse = await axios.get('http://localhost:8000/college/collegeinfo/getAll');
            const collegeInfoData = collegeInfoResponse.data;
    
            // Fetch college names and pic URLs from collegebasics table
            const collegeBasicsResponse = await axios.get('http://localhost:8000/college/getAll');
            const collegeBasicsData = collegeBasicsResponse.data.reduce((acc, curr) => {
                acc[curr.idCollege] = {
                    collegeName: curr.collegeName,
                    picURL: curr.picURL
                };
                return acc;
            }, {});
    
            // Combine college info with college names and pic URLs
            const combinedData = collegeInfoData.map(info => ({
                ...info,
                collegeName: collegeBasicsData[info.idCollege].collegeName,
                picURL: collegeBasicsData[info.idCollege].picURL
            }));
    
            setCollegeInfo(combinedData);
        } catch (error) {
            console.error('Error fetching college info:', error);
        }
    };

    const handleDelete = async (idCollege) => {
        try {
            await axios.delete(`http://localhost:8000/college/collegeinfo/${idCollege}`);
            setCollegeInfo(collegeInfo.filter(info => info.idCollege !== idCollege));
            alert("Deleted!")
        } catch (error) {
            console.error('Error deleting college info:', error);
        }
    };

    const handleEdit = (college) => {
        setSelectedCollege(college);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedCollege(null);
    };

    const handleEditSubmit = (id) => {
        // Implement edit submit logic here
        
        console.log('Edit submitted:', selectedCollege);
        console.log(id)

        const { collegeName, idCollege, picURL, ...data } = selectedCollege;



        axios.put(`http://localhost:8000/college/collegeinfo/${id}`, data)
            .then((res)=>{
                alert("Edited!")
                fetchCollegeInfo()
            }).catch((err)=>{
                console.log(err.response.data.error)
            })
        // handleCloseEditModal();
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedCollege(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setNewCollegeInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddSubmit = async () => {
        try {

            let data = newCollegeInfo
            let val = parseInt(newCollegeInfo["idCollege"], 10)
            data["idCollege"] = val

            await axios.post('http://localhost:8000/college/collegeinfo/create', data);
            fetchCollegeInfo(); // Refresh the list after adding
            setShowAddModal(false);
            setNewCollegeInfo({
                academic: '',
                value: '',
                safety: '',
                location: '',
                athletics: '',
                life: '',
                idCollege: 0
            });
        } catch (error) {
            alert(`Error adding college info: ${error.response.data.error}`);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Manage College Info</h2>
            <button className="btn btn-success me-3" onClick={() => setShowAddModal(true)}>Add Info</button>
            <button className='btn btn-danger' onClick={()=>navigate("/admin/manageCollege")}>Back to Managa Basic College Info</button>
            <div className="row">
                {collegeInfo.map(college => (
                    <div className="col-md-4" key={college.idCollege}>
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">{college.academic}</h5>
                                <p className="card-text">
                                    <img src={college.picURL} alt="No picture available" className="img-fluid img-thumbnail" />
                                    <strong>ID:</strong> {college.idCollege}<br />
                                    <strong>Name:</strong> {college.collegeName}<br />
                                    <strong>Value:</strong> {college.value}<br />
                                    <strong>Safety:</strong> {college.safety}<br />
                                    <strong>Location:</strong> {college.location}<br />
                                    <strong>Athletics:</strong> {college.athletics}<br />
                                    <strong>Student Life:</strong> {college.life}
                                </p>
                                <button className="btn btn-primary me-3" onClick={() => handleEdit(college)}>Edit</button>
                                <button className="btn btn-danger ml-2" onClick={() => handleDelete(college.idCollege)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for Edit College */}
            <div className={`modal ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit College</h5>
                            <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="collegeName" className="form-label">College Name:</label>
                                <div>
                                    <label>{selectedCollege ? selectedCollege.collegeName : ''}</label>
                                </div>
                            </div>
                            {/* Add other input fields for editing college info here */}
                            <div className="mb-3">
                                <label htmlFor="value" className="form-label">Value:</label>
                                <input type="text" id="value" className="form-control" name="value" value={selectedCollege ? selectedCollege.value : ''} onChange={handleEditChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="safety" className="form-label">Safety:</label>
                                <input type="text" id="safety" className="form-control" name="safety" value={selectedCollege ? selectedCollege.safety : ''} onChange={handleEditChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="location" className="form-label">Location:</label>
                                <input type="text" id="location" className="form-control" name="location" value={selectedCollege ? selectedCollege.location : ''} onChange={handleEditChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="athletics" className="form-label">Athletics:</label>
                                <input type="text" id="athletics" className="form-control" name="athletics" value={selectedCollege ? selectedCollege.athletics : ''} onChange={handleEditChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="life" className="form-label">Student Life:</label>
                                <input type="text" id="life" className="form-control" name="life" value={selectedCollege ? selectedCollege.life : ''} onChange={handleEditChange} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary me-3" onClick={handleCloseEditModal}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={()=>handleEditSubmit(selectedCollege.idCollege)}>Confirm Edit</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal backdrop */}
            <div className={`modal-backdrop ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }}></div>

            {/* Modal for Add College Info */}
            <div className={`modal ${showAddModal ? 'show' : ''}`} style={{ display: showAddModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add College Info</h5>
                            <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="academic" className="form-label">Academic:</label>
                                <input type="text" id="academic" className="form-control" name="academic" value={newCollegeInfo.academic} onChange={handleAddChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="value" className="form-label">Value:</label>
                                <input type="text" id="value" className="form-control" name="value" value={newCollegeInfo.value} onChange={handleAddChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="safety" className="form-label">Safety:</label>
                                <input type="text" id="safety" className="form-control" name="safety" value={newCollegeInfo.safety} onChange={handleAddChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="location" className="form-label">Location:</label>
                                <input type="text" id="location" className="form-control" name="location" value={newCollegeInfo.location} onChange={handleAddChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="athletics" className="form-label">Athletics:</label>
                                <input type="text" id="athletics" className="form-control" name="athletics" value={newCollegeInfo.athletics} onChange={handleAddChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="life" className="form-label">Student Life:</label>
                                <input type="text" id="life" className="form-control" name="life" value={newCollegeInfo.life} onChange={handleAddChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="idCollege" className="form-label">College ID:</label>
                                <input type="number" id="idCollege" className="form-control" name="idCollege" value={newCollegeInfo.idCollege} onChange={handleAddChange} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleAddSubmit}>Add Info</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal backdrop */}
            <div className={`modal-backdrop ${showAddModal ? 'show' : ''}`} style={{ display: showAddModal ? 'block' : 'none' }}></div>
        </div>
    );
};

export default AdminManageCollegeInfo;
