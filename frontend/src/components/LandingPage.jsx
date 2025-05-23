import Navbar from './Navbar';
import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <>
            <Navbar></Navbar>
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