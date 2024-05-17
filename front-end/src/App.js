import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import UserRegister from './components/UserRegister';
import AdminRegister from './components/AdminRegister';
import AdminPanel from './components/AdminPanel';
import Home from './components/Home';
import LandingPage from './components/LandingPage';
import UserProfile from './components/UserProfile';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="" element={<Home />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/landingPage" element={<LandingPage />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path='/user/profile'element={<UserProfile />} />
          <Route path="/admin/register" element={<AdminRegister />}/>
          <Route path="/admin/Panel" element={<AdminPanel />}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
