import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function HomePage() {
    const [username, setUsername] = useState('');
    const [posts, setPosts] = useState([]);  // Initially empty array
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user') === '') {
            navigate("/login");
        }
    });

    // GET request for all posts from the server.
    useEffect(() => {
        axios.get("http://localhost:5000/api/home")
            .then(res => {
                setPosts(res.data.posts);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <style>
                {`#postDivs:hover {
                    background-color: #424649 !important;
                }`}
            </style>

            <Navbar type="home"></Navbar>
            <div className="container-fluid mx-0 px-0">
                <div className="row mx-0 px-0">
                    <div className="col-3">
                        <div className="d-flex flex-column">
                            <h1 className='text-center mx-5 my-3'>Users</h1>
                            <div className="container my-3 py-4 px-4 bg-dark text-white rounded-3 shadow-lg">
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="main-page d-flex flex-column">
                            <h1 className="text-center mx-5 my-3">All Posts</h1>
                            <ul className="px-0">
                                {posts.map(post =>
                                // Allow clicking on div to go to a specific post.
                                <div key={post._id} onClick={() => navigate(`/post/${post._id}`)} id="postDivs" className="container my-3 py-4 px-4 bg-dark text-white rounded-3 shadow-lg" style={{cursor: "pointer"}}>
                                    <h3>{post.title}</h3>
                                    <strong>Tags: </strong>
                                    {(post.tags).map(tag => <span key={tag}>#{tag} </span>)}
                                    <br />
                                    <strong>Created by: </strong>
                                    <Link to={`/user/${post.createdBy}`} onClick={event => event.stopPropagation()}>{post.createdBy}</Link>
                                    <br />
                                </div>)}
                            </ul>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
            </div>
        </>
    );
}

export default HomePage;