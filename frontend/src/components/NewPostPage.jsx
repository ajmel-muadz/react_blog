import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function NewPostPage() {
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newTags, setNewTags] = useState('');
    const navigate = useNavigate();

    // Now opposite. If the user is unauthorised, we want to go back.
    useEffect(() => {
        // First check if 'user' key even exists
        if (localStorage.getItem('user')) {
            if (localStorage.getItem('user') === '') {  // If 'user' is empty, we go back to /login.
                navigate('/login');
            }
        } else {
            // In case user key does not even exist, we're just gonna go back to /login.
            navigate('/login');
        }
    });

    const handleNewPost = async () => {
        try {
            const username = localStorage.getItem('user');
            await axios.post(`http://localhost:5000/api/newpost`,
                {title: newTitle, content: newContent, tags: newTags, username: username});
            
            navigate('/home');
        } catch {
            console.log("Error occurred!");
        }
    }

    return(
        <>
            <Navbar type="home"></Navbar>
            <div className='container-fluid mx-0 px-0'>
                <div className='row mx-0 px-0'>
                    <div className='col-3'></div>
                    <div className='col-6'>
                        <div className='main-page d-flex flex-column justify-content-center' style={{height: "90vh"}}>
                            <h1 className='text-center'>Create Post</h1>
                            <div className='mb-3'>
                                <label htmlFor="titleInput" className='form-label'>Title</label>
                                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} type="text" className='form-control' id='titleInput' name='title' placeholder='F1 Bahrain Grand Prix' />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="contentInput" className='form-label'>Content</label>
                                <textarea value={newContent} onChange={e => setNewContent(e.target.value)} className='form-control' name="content" id="contentInput" placeholder='Absolutely love that Oscar Piastri won!!!' rows={3}></textarea>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="tagInput" className='form-label'>Tags (Separate tags with spaces and don't add '#' symbols)</label>
                                <input value={newTags} onChange={e => setNewTags(e.target.value)} type="text" className='form-control' id='tagInput' name='tag' placeholder='formula1 racing motorsports oscarpiastri' />
                            </div>
                            <div className='d-flex justify-content-center'>
                                <button onClick={handleNewPost} type="submit" className="btn btn-dark shadow-sm mb-3 rounded-4 border border-white border-3">Create Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NewPostPage;