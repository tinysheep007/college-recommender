import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import CollegeList from './collegeBox/CollegeList';
import { FaUser, FaBell, FaHeart, FaThumbsUp, FaPlus, FaSignOutAlt } from 'react-icons/fa';

const LandingPage = () => {
    const { isAuthenticated, user, userLogout } = useAuth(); // Destructure the user from useAuth
    const navigate = useNavigate(); 
    const [collegeData, setCollegeData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [minSAT, setMinSAT] = useState('');
    const [maxSAT, setMaxSAT] = useState('');
    const [minGPA, setMinGPA] = useState('');
    const [maxGPA, setMaxGPA] = useState('');

    const [meanSAT, setMeanSAT] = useState('');
    const [meanGPA, setMeanGPA] = useState('');

    const [searchType, setSearchType] = useState('name'); 

    const collegesPerPage = 5;

    const handleUserLogOut = () => {
        userLogout();
        navigate("/login");
    }

    useEffect(() => {
        fetchCollegeBasics();
    }, []);

    const fetchCollegeBasics = () => {
        axios.get("http://localhost:8000/college/getAll")
            .then(response => {
                setCollegeData(response.data);
            })
            .catch(error => console.error('Error fetching users:', error));
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(collegeData.length / collegesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSearch = () => {
        if (searchTerm === ""){
            fetchCollegeBasics();
            setCurrentPage(1);
        }
        else {
            axios.get(`http://localhost:8000/college/search/input?searchTerm=${encodeURIComponent(searchTerm)}`)
                .then(response => {
                    setCollegeData(response.data);
                    setCurrentPage(1);
                })
                .catch(error => console.error('Error searching colleges:', error));
        }
    };

    const handleRangeSearch = () => {
        // console.log(minSAT)
        // console.log(maxSAT)
        // console.log(minGPA)
        // console.log(maxGPA)
        axios.get(`http://localhost:8000/college/search/range?minSAT=${minSAT}&maxSAT=${maxSAT}&minGPA=${minGPA}&maxGPA=${maxGPA}`)
            .then(response => {
                setCollegeData(response.data);
                setCurrentPage(1);
            })
            .catch(error => {
                console.error('Error searching colleges by range:', error)
                alert("Make sure you have proper input for all ranges before search!")
            });
    };

    const handleMeanSearch = () =>{
        axios.get(`http://localhost:8000/college/search/closest?SAT=${meanSAT}&GPA=${meanGPA}`)
            .then((res) => {
                setCollegeData(res.data);

                // console.log(res.data)
            }).catch((err) => {
                alert("Please type in the proper mean SAT and GPA!")
                console.log(err);
            });
    }

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        // Reset all search input fields when switching search types
        setSearchTerm('');
        setMinSAT('');
        setMaxSAT('');
        setMinGPA('');
        setMaxGPA('');
        setMeanSAT('');
        setMeanGPA('');
        // Refetch college basics when switching search types
        fetchCollegeBasics();
    };
    
    const indexOfLastCollege = currentPage * collegesPerPage;
    const indexOfFirstCollege = indexOfLastCollege - collegesPerPage;
    const currentColleges = collegeData.slice(indexOfFirstCollege, indexOfLastCollege);

    return (
        <div className="container mt-5">
            <h1 className='fw-bold fs-1 mb-4'>College Recommender</h1>

            <div className="my-3">
                    <Link to="/user/profile" className="btn btn-outline-success me-2 ">
                        <FaUser className="me-1" /> User Profile
                    </Link>
                    <Link to="/user/notices" className="btn btn-outline-info me-2">
                        <FaBell className="me-1" /> User Notice
                    </Link>
                    <Link to="/user/likedColleges" className='btn btn-outline-danger me-2 '>
                        <FaHeart className="me-1" /> Liked/Saved Colleges
                    </Link>
                    <Link to="/user/foryou" className='btn btn-outline-warning me-2 '>
                        <FaThumbsUp className="me-1" /> Recommended For You
                    </Link>
                    <Link to="/user/suggest" className='btn btn-outline-primary me-2 '>
                        <FaPlus className="me-1" /> Suggest to Add a College
                    </Link>
                    { user && (
                        <button className="btn btn-outline-secondary " onClick={handleUserLogOut}>
                            <FaSignOutAlt className="me-1" /> Logout
                        </button>
                    )}
            </div>
        


            {/* Check if user is authenticated before rendering */}
            {isAuthenticated && (
                <div className="mb-3">
                    <p className='fs-6 fw-bold'>Welcome, {user.username}!</p>
                </div>
            )}

    <div className="mb-3">
        <div className="form-check form-check-inline">
            <input
                className="form-check-input"
                type="radio"
                name="searchType"
                id="searchByName"
                value="name"
                checked={searchType === 'name'}
                onChange={handleSearchTypeChange}
            />
            <label className="form-check-label" htmlFor="searchByName">Search by Name</label>
        </div>
        <div className="form-check form-check-inline">
            <input
                className="form-check-input"
                type="radio"
                name="searchType"
                id="searchByRange"
                value="range"
                checked={searchType === 'range'}
                onChange={handleSearchTypeChange}
            />
            <label className="form-check-label" htmlFor="searchByRange">Search by Range</label>
        </div>
        <div className="form-check form-check-inline">
            <input
                className="form-check-input"
                type="radio"
                name="searchType"
                id="searchByMean"
                value="mean"
                checked={searchType === 'mean'}
                onChange={handleSearchTypeChange}
            />
            <label className="form-check-label" htmlFor="searchByMean">Search by Mean</label>
        </div>
    </div>


                <div className="mb-3">
                 {searchType === 'name'&& (<div className="input-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                    <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                </div>  )}



                {searchType == "range" && ( <div className="row mt-3">
                    <div className="col">
                        <input 
                            type="number" 
                            className="form-control" 
                            placeholder="Min SAT" 
                            value={minSAT} 
                            onChange={(e) => setMinSAT(e.target.value)} 
                        />
                    </div>
                    <div className="col">
                        <input 
                            type="number" 
                            className="form-control" 
                            placeholder="Max SAT" 
                            value={maxSAT} 
                            onChange={(e) => setMaxSAT(e.target.value)} 
                        />
                    </div>
                    <div className="col">
                        <input 
                            type="number" 
                            className="form-control" 
                            placeholder="Min GPA" 
                            value={minGPA} 
                            onChange={(e) => setMinGPA(e.target.value)} 
                        />
                    </div>
                    <div className="col">
                        <input 
                            type="number" 
                            className="form-control" 
                            placeholder="Max GPA" 
                            value={maxGPA} 
                            onChange={(e) => setMaxGPA(e.target.value)} 
                        />
                    </div>
                    <div className="col">
                        <button className="btn btn-primary" onClick={handleRangeSearch}>Search by Range</button>
                    </div>
                </div> )}



            </div>


            {searchType == "mean" && ( <div className="row mb-3">
                    <div className="col">
                        <input 
                            type="number" 
                            className="form-control" 
                            placeholder="Mean SAT" 
                            value={meanSAT} 
                            onChange={(e) => setMeanSAT(e.target.value)} 
                        />
                    </div>

                    <div className="col">
                        <input 
                            type="number" 
                            className="form-control" 
                            placeholder="Mean GPA" 
                            value={meanGPA} 
                            onChange={(e) => setMeanGPA(e.target.value)} 
                        />
                    </div>

                    <div className="col">
                        <button className="btn btn-primary" onClick={handleMeanSearch}>Search by Cloest to Mean</button>
                    </div>

            </div> )}

            <CollegeList data={currentColleges} />

            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-primary" onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button className="btn btn-primary" onClick={handleNextPage} disabled={currentPage === Math.ceil(collegeData.length / collegesPerPage)}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
