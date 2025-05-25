import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar(props) {
    const [username, setUsername] = useState(localStorage.getItem(''));
    const [inputValue, setInputValue] = useState('');

    // useEffect helps run without crashing as it only executes after rendering everything.
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser != '') {
            setUsername(storedUser);
        }
    }, []);

    // This ensures that only when the button is clicked, we set the serach query.
    const handleSearch = () => {
        props.setSearchQuery(inputValue);
    }

    if (props.type === "minimal") {
        // Simple navbar seen in landing page, login and register.
        return (
            <>
                <nav className="navbar bg-dark">
                    <div className="row container-fluid m-0 p-0">
                        <div className="col-4"></div>
                        <div className="col-4 d-flex justify-content-center align-items-center">
                            <a className="navbar-brand text-white my-2 mx-0 p-0 h1">Blog Post Management System</a>
                        </div>
                        <div className="col-4"></div>
                    </div>
                </nav>
            </>
        );
    } else if (props.type === "home") {
        return (
            <>
                <style>
                    {`#logoutLink:hover, #myBlogsLink:hover, #homeLink:hover, #newPostLink:hover {
                        color: rgb(188, 186, 186) !important;
                    }`}
                </style>

                <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
                    <div className="container-fluid">
                        <span className="navbar-brand text-white" style={{fontWeight: "bold"}}>{username}</span>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <div className="navbar-nav me-auto mb-2 mb-lg-0">
                                <Link onClick={() => localStorage.setItem('user', '')} className="nav-link text-white" id="logoutLink" to="/login">Logout</Link>
                                <Link className="nav-link text-white" id="homeLink" to="/home">Home</Link>
                                <Link className='nav-link text-white' id="newPostLink" to="/newpost">New Post</Link>
                            </div>
                            <div className="d-flex">
                                <input value={inputValue} onChange={e => setInputValue(e.target.value)} className="form-control me-2" name="search" type="search" placeholder="Search with title or tags" aria-label="Search" />
                                <button onClick={handleSearch} className="btn btn-success" type="submit">Search</button>
                            </div>
                        </div>
                    </div>
                </nav>
            </>
        );
    }
}

export default Navbar;