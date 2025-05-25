import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import PostDetailsPage from './components/PostDetailsPage';
import AuthorProfilePage from './components/AuthorProfilePage';
import EditPostPage from './components/EditPostPage';
import NewPostPage from './components/NewPostPage';
import { Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
const socket = io.connect("http://localhost:5000");

function App() {
  const [activeUsers, setActiveUsers] = useState({});
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (localStorage.getItem('user')) {
      const username = localStorage.getItem('user');
      if (username) {
        socket.emit("user_connection", username);
      }
    }
  }, []);

  useEffect(() => {
    socket.on('active_users', (data) => {
      setActiveUsers(data);
    })
  }, []);

  useEffect(() => {
    socket.on("new_post", (data) => {
      const message = `New post by ${data['creator']}: ${data['title']}`;
      setNotification(message);

      // After 5 seconds we close the notif
      setTimeout(() => setNotification(''), 5000);
    })
  }, []);

  return (
    <>
      {/* Notification Banner */}
      {notification && (
        <div className="alert alert-info text-center m-0 rounded-0" role="alert">
          {notification}
        </div>
      )}

      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element="Register page" />
        <Route path="/home" element={<HomePage activeUsers={activeUsers}/>} />
        <Route path="/post/:postId" element={<PostDetailsPage/>}/>
        <Route path="/user/:username" element={<AuthorProfilePage/>}/>
        <Route path="/post/:postId/edit" element={<EditPostPage/>}/>
        <Route path="/newpost" element={<NewPostPage/>}/>
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
}

export default App;