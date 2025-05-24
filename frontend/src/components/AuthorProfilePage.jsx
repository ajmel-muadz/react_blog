import axios from 'axios';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function AuthorProfilePage() {
    const [posts, setPosts] = useState([]);
    const { username } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user') === '') {
            navigate('/login');
        }
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/api/user/${username}`)
            .then(res => {
                setPosts(res.data.usersPosts);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <Navbar type="home"></Navbar>
            <div className="container-fluid mx-0 px-0">
                <div className="row mx-0 px-0">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <div className="main-page d-flex flex-column">
                            <h1 className="text-center mx-5 my-3">Author Profile Page</h1>
                            <h3 className="text-center mx-5 my-3">User: {username}, Post count: {posts.length}</h3>
                            <button className="btn btn-dark shadow-sm w-25 mx-auto mb-3">Subscribe</button>
                            <ul className="px-0">
                                {posts.map(post =>
                                <div key={post._id} className="container my-3 py-4 px-4 bg-dark text-white rounded-3 shadow-lg">
                                    <h3>{post.title}</h3>
                                    <strong>Tags: </strong>
                                    {(post.tags).map(tag => <span key={tag}>#{tag} </span>)}
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

export default AuthorProfilePage;