import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import PostDetailsPage from './components/PostDetailsPage';
import AuthorProfilePage from './components/AuthorProfilePage';
import EditPostPage from './components/EditPostPage';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element="Register page" />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/post/:postId" element={<PostDetailsPage/>}/>
        <Route path="/user/:username" element={<AuthorProfilePage/>}/>
        <Route path="/post/:postId/edit" element={<EditPostPage/>}/>
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
}

export default App;