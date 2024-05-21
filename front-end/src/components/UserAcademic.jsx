import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.js';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const UserAcademic = () => {
    const { user } = useAuth();
    const [SAT, setSAT] = useState(0);
    const [GPA, setGPA] = useState(3.5);
    const [extra, setExtra] = useState("music, marching band");
    const [others, setOthers] = useState("nothing else to add");
    const [majors, setMajors] = useState("Accountant");

    useEffect(() => {
        fetchAcademicInfo();
    }, []);

    const handleSave = async (field, value) => {
        let val = 0;

        if (field === "SAT") {
            val = parseInt(value, 10);
        } else if (field === "GPA") {
            val = parseFloat(value);
        } else {
            val = value;
        }

        const d1 = ({
            idusers: user.idusers,
            SAT,
            GPA,
            extra,
            others,
            majors
        });

        const temp = {
            ...d1,
            [field]: val
        };

        axios.put("http://localhost:8000/user/academic/update", temp)
            .then((res) => {
                alert("Edited successfully!");
            }).catch((err) => {
                alert(err);
                console.log(err);
            });
    };

    const fetchAcademicInfo = () => {
        axios.get(`http://localhost:8000/user/academic/${user.idusers}`)
            .then((res) => {
                if (res.data.success && res.data.results.length === 0) {
                    let obj = {
                        idusers: user.idusers,
                        SAT: 1200,
                        GPA: 3.5,
                        extra: "",
                        others: "",
                        majors: ""
                    };
                    axios.post("http://localhost:8000/user/academic/create", obj)
                        .then((res) => {
                            console.log("New profile created");
                        }).catch((err) => {
                            console.log(err);
                        });
                } else if (res.data.success && res.data.results[0].length !== 0) {
                    let results = res.data.results[0];
                    setSAT(results["SAT"]);
                    setGPA(results["GPA"]);
                    setExtra(results["extra"]);
                    setOthers(results["others"]);
                    setMajors(results["majors"]);
                }
            }).catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">User Academic Information</h1>
            <Link to="/user/profile" className="btn btn-success mb-3">Back to Profile</Link>
            <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">SAT:</label>
                <div className="col-sm-8">
                    <input
                        type="number"
                        className="form-control"
                        value={SAT}
                        onChange={(e) => setSAT(e.target.value)}
                    />
                </div>
                <div className="col-sm-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => handleSave('SAT', SAT)}
                    >
                        Save
                    </button>
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">GPA:</label>
                <div className="col-sm-8">
                    <input
                        type="number"
                        className="form-control"
                        value={GPA}
                        onChange={(e) => setGPA(e.target.value)}
                    />
                </div>
                <div className="col-sm-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => handleSave('GPA', GPA)}
                    >
                        Save
                    </button>
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">Extracurricular:</label>
                <div className="col-sm-8">
                    <input
                        type="text"
                        className="form-control"
                        value={extra}
                        onChange={(e) => setExtra(e.target.value)}
                    />
                </div>
                <div className="col-sm-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => handleSave('extra', extra)}
                    >
                        Save
                    </button>
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">Comments:</label>
                <div className="col-sm-8">
                    <input
                        type="text"
                        className="form-control"
                        value={others}
                        onChange={(e) => setOthers(e.target.value)}
                    />
                </div>
                <div className="col-sm-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => handleSave('others', others)}
                    >
                        Save
                    </button>
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">Majors:</label>
                <div className="col-sm-8">
                    <input
                        type="text"
                        className="form-control"
                        value={majors}
                        onChange={(e) => setMajors(e.target.value)}
                    />
                </div>
                <div className="col-sm-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => handleSave('majors', majors)}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserAcademic;
