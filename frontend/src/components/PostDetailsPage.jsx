import axios from 'axios';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function PostDetailsPage() {
    const [post, setPost] = useState([]);
    const { postId } = useParams();
    const [subscriptionStatus, setSubscriptionStatus] = useState('');
    const navigate = useNavigate();

    const myUsername = localStorage.getItem('user');
    const authorUsername = post.createdBy;

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
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const handleDelete = async () => {
        try {
            const res = await axios.post(`http://localhost:5000/api/post/${postId}/delete`)
            navigate("/home");
        } catch {
            console.log("Error occurred!");
        }
    }

    // Used to see if a user is subscribed or nah.
    useEffect(() => {
        axios.get("http://localhost:5000/api/subscriptions", { params: {
            subscriber: myUsername, creator: authorUsername
        }})
            .then(res => {
                setSubscriptionStatus(res.data.subscriptionStatus);
            })
            .catch(err => {
                console.log(err);
            });
    });

    const handleSubscribe = async () => {
        try {
            await axios.post(`http://localhost:5000/api/subscribe`,
                {subscriber: myUsername, creator: authorUsername});
            setSubscriptionStatus("Subscribed");
        } catch {
            console.log("Error occurred!");
        }
    }

    const handleUnsubscribe = async () => {
        try {
            await axios.post(`http://localhost:5000/api/unsubscribe`,
                {subscriber: myUsername, creator: authorUsername});
            setSubscriptionStatus("Not Subscribed");
        } catch {
            console.log("Error occurred!");
        }
    }

    let subscriptionButton = null;
    if (myUsername !== authorUsername) {
        if (subscriptionStatus === "Subscribed") {
            subscriptionButton = <button onClick={handleUnsubscribe} className="btn btn-danger shadow-sm w-25 mx-auto mt-2 mb-2">Unsubscribe</button>
        } else if (subscriptionStatus === "Not Subscribed") {
            subscriptionButton = <button onClick={handleSubscribe} className="btn btn-success shadow-sm w-25 mx-auto mt-2 mb-2">Subscribe</button>
        }
    }

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
                                <div className="container mt-5 mb-2 py-4 px-4 bg-dark text-white rounded-3 shadow-lg">
                                    <h3>{post.title}</h3>
                                    <p>{post.content}</p>
                                    <strong>Tags: </strong>
                                    {/* If post and post.tags exist, we then render. Else, do null. Avoid crashing. */}
                                    {post && post.tags ? post.tags.map(tag => <span key={tag}>#{tag} </span>) : null}
                                    <br />
                                    <strong>Created by: </strong>
                                    <Link to={`/user/${post.createdBy}`}>{post.createdBy}</Link>
                                    <br />
                                    {subscriptionButton}
                                    <br />
                                    <strong>Created at: </strong>
                                    <span>{post.createdAt}</span>
                                </div>

                                {/* If the current user matches post author, allow editing or delete. */}
                                {localStorage.getItem('user') === post.createdBy ?
                                <div className="d-flex flex-row">
                                    <button onClick={handleDelete} className="btn btn-danger shadow me-3">Delete</button>
                                    <Link to={`/post/${postId}/edit`}>
                                        <button className="btn btn-warning shadow">Edit</button>
                                    </Link>
                                </div> : null}
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