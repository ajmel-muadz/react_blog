import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element="Register page" />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;