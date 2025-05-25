import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import PostDetailsPage from './components/PostDetailsPage';
import AuthorProfilePage from './components/AuthorProfilePage';
import EditPostPage from './components/EditPostPage';
import { Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
const socket = io.connect("http://localhost:5000");

function App() {
  const [activeUsers, setActiveUsers] = useState({});

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
  }, [socket]);

  console.log(activeUsers);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element="Register page" />
        <Route path="/home" element={<HomePage activeUsers={activeUsers}/>} />
        <Route path="/post/:postId" element={<PostDetailsPage/>}/>
        <Route path="/user/:username" element={<AuthorProfilePage/>}/>
        <Route path="/post/:postId/edit" element={<EditPostPage/>}/>
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
}

export default App;