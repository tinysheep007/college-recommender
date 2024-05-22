import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Login from './components/Login';
import Home from './components/Home';
import LandingPage from './components/LandingPage';

import AdminRegister from './components/AdminRegister';
import AdminPanel from './components/AdminPanel';
import AdminNotice from './components/AdminNotice';
import AdminManageCollege from './components/AdminManageCollege';
import AdminManageCollegInfo from './components/AdminManageCollegeInfo';

import UserRegister from './components/UserRegister';
import UserProfile from './components/UserProfile';
import UserNotice from './components/UserNotice';
import UserLikedColleges from './components/UserLikedColleges';
import UserAcademic from './components/UserAcademic';
import Foryou from './components/Foryou';
import CollegeDetail from './components/collegeBox/CollegeDetail';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="" element={<Home />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/landingPage" element={<LandingPage />} />
          
          <Route path="/admin/register" element={<AdminRegister />}/>
          <Route path="/admin/Panel" element={<AdminPanel />}/>
          <Route path="/admin/notices" element={<AdminNotice />}/>
          <Route path='/admin/manageCollege' element={<AdminManageCollege />}/>
          <Route path='/admin/manageCollegeInfo' element={<AdminManageCollegInfo />}/>

          <Route path="/user/register" element={<UserRegister />} />
          <Route path='/user/profile'element={<UserProfile />} />
          <Route path='/user/notices' element={<UserNotice />}/>
          <Route path='/user/likedColleges' element={<UserLikedColleges />}/>
          <Route path='/user/academic' element={<UserAcademic />}/>
          <Route path='/user/foryou' element={<Foryou />}/>

          <Route path='/college/:id' element={<CollegeDetail />}/>

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
