import Navbar from './Navbar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import flash from 'express-flash';

function RegisterPage() {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // First check if 'user' key even exists
        if (localStorage.getItem('user')) {
            if (localStorage.getItem('user') !== '') {  // If 'user' exists and is not empty, we fast-track.
                navigate('/home');
            }
        }
    });

    const handleRegister = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/register", {newUsername, newPassword, confirmPassword});
            localStorage.setItem('user', res.data.user);
            navigate("/home");
        } catch (err) {
            console.log(err);
            setErrorMessage(err.response.data.error);
            setNewUsername("");
            setNewPassword("");
            setConfirmPassword("");
        }
    }

    return (
        <>
            <Navbar type="minimal"></Navbar>
            <div className='container-fluid mx-0 px-0'>
                <div className="row mx-0 px-0">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <div className="main-page d-flex flex-column justify-content-center" style={{height: "90vh"}}>
                            <h1 className='text-center mb-3'>Register</h1>
                            {errorMessage ? <div className="alert alert-danger" role="alert">{errorMessage}</div> : null}
                            <div className='mb-3'>
                                <label htmlFor="usernameInputRegister" className='form-label'>New Username</label>
                                <input value={newUsername} onChange={e => setNewUsername(e.target.value)} type="text" className='form-control' id='usernameInputRegister' name='username' placeholder='johndoe' />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="passwordInputRegister" className='form-label'>New Password</label>
                                <input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" className='form-control' id="passwordInputRegister" name="password" placeholder="qwwertyuiop123!@#$" />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="confirmPasswordInputRegister" className='form-label'>Confirm New Password</label>
                                <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" className='form-control' id="confirmPasswordInputRegister" name="confirmPassword" placeholder="qwwertyuiop123!@#$" />
                            </div>
                            <button onClick={handleRegister} type="submit" className="btn btn-dark shadow-sm w-100 mb-3">Register</button>
                            <p className='text-center'>Go back to <Link to="/login">Login</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RegisterPage;