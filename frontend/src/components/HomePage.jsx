import axios from 'axios';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { valid } from '@hapi/joi';

function HomePage() {
    const [username, setUsername] = useState(localStorage.getItem(''));
    const [posts, setPosts] = useState([]);  // Initially empty array

    // useEffect helps run without crashing as it only executes after rendering everything.
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser != '') {
            setUsername(storedUser);
        }
    }, []);

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
            <Navbar type="home"></Navbar>
            <div className="container-fluid mx-0 px-0">
                <div className="row mx-0 px-0">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <div className="main-page d-flex flex-column">
                            <h1 className="text-center mx-5 my-3">All Posts</h1>
                            <ul className="px-0">
                                {posts.map(post =>
                                <div key={post._id} className="container my-3 py-4 px-4 bg-dark text-white rounded-3 shadow-lg">
                                    <h3>{post.title}</h3>
                                    <p>{post.content}</p>
                                    <strong>Tags: </strong>
                                    {(post.tags).map(tag => <span>#{tag} </span>)}
                                    <br/>
                                    <strong>Created by: </strong>
                                    <span>{post.createdBy}</span>
                                    <br/>
                                    <strong>Created at: </strong>
                                    <span>{post.createdAt}</span>
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