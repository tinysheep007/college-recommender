import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    return (
        <div>
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <h1 className="display-4">Welcome to College Recommender</h1>
                    <p className="lead">Your ultimate tool to find the best college for you.</p>
                    
                    <p>
                        Our College Recommender app helps you find the perfect college that matches your academic profile and preferences. Administrators can manage user accounts, user notices, and college information, as well as approve new school suggestions. Basic users can log in or register, browse and search for colleges, add favorites, update their profile and academic information, and receive personalized college suggestions. Stay informed with user notices and engage with college details through comments.
                    </p>
                    <p>
                        Start your journey towards finding the best college with College Recommender!
                    </p>
                    <Link className="btn btn-primary btn-sm fs-3" to="/login">Begin Browsing</Link>

                    <div className="mt-4">
                        <img src="./cover.png" alt="College 1" className="img-fluid me-3 width-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
