import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import MoviesPage from "./components/MoviesPage"; 
import SeriesPage from "./components/SeriesPage"; 
import DetailPage from "./components/DetailPage"; // Import DetailPage
import Pattern from "./components/Pattern";
import type { PersonalInfo } from "./type";
import axios from "axios";
import './index.css';
import { mockUserDashboardData } from './mockData'; 

const initialData: PersonalInfo = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const App: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(initialData);
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [loggedInUserEmail, setLoggedInUserEmail] = useState(''); 
  const [displayUserName, setDisplayUserName] = useState(''); 

  const handleUpdate = (info: PersonalInfo) => {
    setPersonalInfo(info);
  };

  const handleSubmit = async (isLoginForm: boolean) => {
    setMessage('');
    setError('');

    const endpoint = isLoginForm ? 'http://127.0.0.1:5000/api/login' : 'http://127.0.0.1:5000/api/signup';
    const payload = {
      email: personalInfo.email,
      password: personalInfo.password,
      ...(isLoginForm ? {} : { userName: personalInfo.userName }) 
    };

    try {
      const response = await axios.post(endpoint, payload);
      setMessage(response.data.message);
      setPersonalInfo(initialData); 
      
      if (isLoginForm && response.status === 200) {
        setIsLoggedIn(true);
        setLoggedInUserEmail(personalInfo.email); 
        const userInMock = mockUserDashboardData.find(user => user.email === personalInfo.email);
        setDisplayUserName(userInMock ? userInMock.userName : personalInfo.email.split('@')[0] || 'کاربر'); 
      } else if (!isLoginForm && response.status === 201) {
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An unexpected error occurred. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUserEmail(''); 
    setDisplayUserName('');
    setIsLogin(true);
    setPersonalInfo(initialData);
    setMessage('');
    setError('');
  };

  const toggleForm = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
    setPersonalInfo(initialData);
    setMessage('');
    setError('');
  };

  return (
    <Router>
      <div className="relative min-h-screen flex flex-col justify-center items-center p-4"> 
        <Pattern /> 

        <div className="z-10 w-full h-full flex justify-center items-center">
          <Routes>
            <Route 
              path="/" 
              element={
                isLoggedIn ? <Navigate to="/dashboard" /> : (
                  <AuthForm
                    personalInfo={personalInfo}
                    onUpdate={handleUpdate}
                    onSubmit={handleSubmit}
                    isLogin={isLogin}
                    toggleForm={toggleForm}
                    message={message}
                    error={error}
                  />
                )
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isLoggedIn ? (
                  <Dashboard userEmail={loggedInUserEmail} userName={displayUserName} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/" /> 
                )
              } 
            />
            <Route 
              path="/movies" 
              element={
                isLoggedIn ? <MoviesPage /> : <Navigate to="/" /> 
              } 
            />
            <Route 
              path="/series" 
              element={
                isLoggedIn ? <SeriesPage /> : <Navigate to="/" /> 
              } 
            />
            {/* New route for content detail pages */}
            <Route 
              path="/content/:id" // Using a generic ID for now
              element={
                isLoggedIn ? <DetailPage /> : <Navigate to="/" /> 
              } 
            />
            <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
