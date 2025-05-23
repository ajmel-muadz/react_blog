import Navbar from './Navbar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import flash from 'express-flash';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/login", {username, password});
            console.log(res.data);
            navigate("/home");
        } catch {
            setErrorMessage("Invalid login. Ensure username or password is correct.");
        }
    }

    return (
        <>
            <Navbar></Navbar>
            <div className="container-fluid mx-0 px-0">
                <div className="row mx-0 px-0">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <div className="main-page d-flex flex-column justify-content-center" style={{height: "90vh"}}>
                            <h1 className="text-center mb-3">Login</h1>
                            {/* If errorMessage is true, display the alert. Else, we display nothing. In JS, empty string = falsy. */}
                            {errorMessage ? <div className="alert alert-danger" role="alert">{errorMessage}</div> : null}
                            <div className="mb-3">
                                <label htmlFor="usernameInputLogin" className="form-label">Username</label>
                                <input value={username} onChange={e => setUsername(e.target.value)} type="text" className="form-control" id="usernameInputLogin" name="username" placeholder="johndoe" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="passwordInputLogin" className="form-label">Password</label>
                                <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" id="passwordInputLogin" name="password" placeholder="qwwertyuiop123!@#$" />
                            </div>
                            <button onClick={handleLogin} type="submit" className="btn btn-dark shadow-sm w-100 mb-3">Login</button>
                            <p className="text-center">Don't have an account? <Link to="/register">Register</Link></p>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;