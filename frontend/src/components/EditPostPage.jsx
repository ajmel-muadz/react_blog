import axios from 'axios';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function EditPostPage() {
    const [post, setPost] = useState([]);
    const { postId } = useParams();

    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editTag, setEditTag] = useState('');

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

    useEffect(() => {
        axios.get(`http://localhost:5000/api/post/${postId}`)
            .then(res => {
                setPost(res.data.post);
                setEditTitle(res.data.post.title);
                setEditContent(res.data.post.content);

                // Need to do this because originally separated by commas.
                let modifiedTags = (res.data.post.tags).join(" ");
                setEditTag(modifiedTags);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const handleEdit = async () => {
        try {
            const res = await axios.post(`http://localhost:5000/api/post/${postId}/edit`,
                {title: editTitle, content: editContent, tags: editTag});

            navigate("/home");

        } catch {
            console.log("Error occured!");
        }
    }

    return (
        <>
            <Navbar type="home"></Navbar>
            <div className="container-fluid mx-0 px-0">
                <div className='row mx-0 px-0'>
                    <div className='col-3'></div>
                    <div className='col-6'>
                        <div className='main-page d-flex flex-column justify-content-center' style={{height: "90vh"}}>
                            <h1 className='text-center'>Edit Post</h1>
                            <div className='mb-3'>
                                <label htmlFor="titleInput" className='form-label'>Title</label>
                                <input type="text" className='form-control' id='titleInput' name='title' placeholder='F1 Bahrain Grand Prix' value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="contentInput" className='form-label'>Content</label>
                                <textarea className='form-control' name="content" id="contentInput" placeholder='Absolutely love that Oscar Piastri won!!!' rows={3} value={editContent} onChange={e => setEditContent(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="tagInput" className='form-label'>Tags (Separate tags with spaces and don't add '#' symbols)</label>
                                <input type="text" className='form-control' id='tagInput' name='tag' placeholder='formula1 racing motorsports oscarpiastri' value={editTag} onChange={e => setEditTag(e.target.value)} />
                            </div>
                            <div className='d-flex justify-content-center'>
                                <button onClick={handleEdit} type='submit' className='btn btn-dark shadow-sm mb-3 rounded-4 border border-white border-3'>Edit Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditPostPage;