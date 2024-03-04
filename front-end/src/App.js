import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import UserRegister from './components/UserRegister';
import AdminRegister from './components/AdminRegister';
import AdminPanel from './components/AdminPanel';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/admin/register" element={<AdminRegister />}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
