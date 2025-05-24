import axios from 'axios';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function PostDetailsPage() {
    const [post, setPost] = useState([]);
    const { postId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user') === '') {
            navigate('/home');
        }
    });
    
    useEffect(() => {
        axios.get(`http://localhost:5000/api/post/${postId}`)
            .then(res => {
                setPost(res.data.post);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    return (
        <>
            <Navbar type="home"></Navbar>
            <div className="container-fluid mx-0 px-0">
                <div className="row mx-0 px-0">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <div className="main-page d-flex flex-column">
                            <h1 className="text-center mx-5 my-3">Post Details: "{post.title}"</h1>
                            <ul className="px-0">
                                <div className="container my-3 py-4 px-4 bg-dark text-white rounded-3 shadow-lg">
                                    <h3>{post.title}</h3>
                                    <p>{post.content}</p>
                                    <strong>Tags: </strong>
                                    {/* If post and post.tags exist, we then render. Else, do null. Avoid crashing. */}
                                    {post && post.tags ? post.tags.map(tag => <span key={tag}>#{tag} </span>) : null}
                                    <br />
                                    <strong>Created by: </strong>
                                    <Link to={`/user/${post.createdBy}`}>{post.createdBy}</Link>
                                    <br />
                                    <strong>Created at: </strong>
                                    <span>{post.createdAt}</span>
                                </div>
                            </ul>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
            </div>
        </>
    );
}

export default PostDetailsPage;