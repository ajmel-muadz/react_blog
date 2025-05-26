import axios from 'axios';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function SubscriptionsPage() {
    const myUsername = localStorage.getItem('user');
    const [creators, setCreators] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/allsubscriptions", {params: {
            subscriber: myUsername
        }})
            .then(res => {
                setCreators(res.data.allsubscriptions);
            })
            .catch(err => {
                console.log(err);
            });
    }, [creators])

    const handleUnsubscribe = async (creator) => {
        try {
            await axios.post(`http://localhost:5000/api/unsubscribe`,
                {subscriber: myUsername, creator: creator});
        } catch {
            console.log("Error occurred!");
        }
    }

    return (
        <>
            <Navbar type="home"></Navbar>
            <div className='container-fluid mx-0 px-0'>
                <div className='row mx-0 px-0'>
                    <div className='col-3'></div>
                    <div className='col-6'>
                        <div className='main-page d-flex flex-column'>
                            <h1 className="text-center mx-5 my-3">Subscriptions</h1>
                            <ul className='px-0'>
                                {creators.map(creator => (
                                    <div key={creator}>
                                        <div className="container my-3 py-4 px-4 bg-dark text-white rounded-3 shadow-lg">
                                            <h3>{creator}</h3>
                                            <button onClick={() => handleUnsubscribe(creator)} className="btn btn-danger shadow-sm w-25 mx-auto mt-2">Unsubscribe</button>
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SubscriptionsPage;