import axios from 'axios';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function AuthorProfilePage() {
    const [posts, setPosts] = useState([]);
    const { username } = useParams();
    const [postId, setPostId] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState('');
    const navigate = useNavigate();

    const myUsername = localStorage.getItem('user');
    const authorUsername = username;

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

    // Render all user posts.
    useEffect(() => {
        axios.get(`http://localhost:5000/api/user/${username}`)
            .then(res => {
                setPosts(res.data.usersPosts);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

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

    const handleDelete = async (postId) => {
        try {
            await axios.post(`http://localhost:5000/api/post/${postId}/delete`)
            // Re run fetch again to update the view.
            axios.get(`http://localhost:5000/api/user/${username}`)
                .then(res => {
                    setPosts(res.data.usersPosts);
                })
                .catch(err => {
                    console.log(err);
                });
        } catch {
            console.log("Error occurred!");
        }
    }

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
            subscriptionButton = <button onClick={handleUnsubscribe} className="btn btn-danger shadow-sm w-25 mx-auto mb-3">Unsubscribe</button>
        } else if (subscriptionStatus === "Not Subscribed") {
            subscriptionButton = <button onClick={handleSubscribe} className="btn btn-dark shadow-sm w-25 mx-auto mb-3">Subscribe</button>
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
                            <h1 className="text-center mx-5 my-3">Author Profile Page</h1>
                            <h3 className="text-center mx-5 my-3">User: {username}, Post count: {posts.length}</h3>
                            {subscriptionButton}
                            <ul className='px-0'>
                                {posts.map(post => (
                                    <div key={post._id}>
                                        <div className="container my-3 py-4 px-4 bg-dark text-white rounded-3 shadow-lg">
                                            <h3>{post.title}</h3>
                                            <p>{post.content}</p>
                                            <strong>Tags: </strong>
                                            {(post.tags).map(tag => <span key={tag}>#{tag} </span>)}
                                            <br />
                                            <strong>Created at: </strong>
                                            <span>{post.createdAt}</span>
                                        </div>

                                        {/* If the current user matches post author, allow editing or delete. */}
                                        {localStorage.getItem('user') === username ?
                                        <div className="d-flex flex-row">
                                            <button onClick={() => handleDelete(post._id)} className="btn btn-danger shadow me-3">Delete</button>
                                            <Link to={`/post/${post._id}/edit`}>
                                                <button className="btn btn-warning shadow">Edit</button>
                                            </Link>
                                        </div> : null}
                                    </div>  
                                ))}
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