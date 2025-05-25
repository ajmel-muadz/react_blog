import Navbar from './Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function LandingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // First check if 'user' key even exists
        if (localStorage.getItem('user')) {
            if (localStorage.getItem('user') !== '') {  // If 'user' exists and is not empty, we fast-track.
                navigate('/home');
            }
        }
    });

    return (
        <>
            <Navbar type="minimal"></Navbar>
            <div className="main-page d-flex flex-column justify-content-center align-items-center" style={{height: "90vh"}}>
                <h1 className="text-center mx-5 my-3">
                    Welcome to Ajmel's (React) Blog Post Management System
                </h1>
                <p className="text-center mx-5">We will help you post your own blogs, as well as view other users' blogs!</p>
                <Link to="/login">
                    <button type="button" className="btn btn-dark shadow-sm">Get Started</button>
                </Link>
            </div>
        </>
    );
}

export default LandingPage;