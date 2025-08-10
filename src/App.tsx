import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import MoviesPage from "./components/MoviesPage"; 
import SeriesPage from "./components/SeriesPage"; 
import DetailPage from "./components/DetailPage";
import FavoritesPage from "./components/FavoritesPage"; // Import the new FavoritesPage
import WatchlistPage from "./components/WatchListPage";
import Pattern from "./components/Pattern";
import type { PersonalInfo } from "./type";
import axios from "axios";
import './index.css';
import { type UserDashboardData } from './mockData'; 

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
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedLoggedIn = localStorage.getItem('isLoggedIn');
      const storedUserEmail = localStorage.getItem('loggedInUserEmail');
      const storedUserName = localStorage.getItem('displayUserName');
      const storedUserId = localStorage.getItem('loggedInUserId');

      if (storedLoggedIn === 'true' && storedUserEmail && storedUserName && storedUserId) {
        setIsLoggedIn(true);
        setLoggedInUserEmail(storedUserEmail);
        setDisplayUserName(storedUserName);
        setLoggedInUserId(parseInt(storedUserId, 10)); 
      }
    } catch (e) {
      console.error("Failed to load session from localStorage", e);
      handleLogout(); 
    }
  }, []); 

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
        const userEmail = personalInfo.email;
        const userName = response.data.user?.username || personalInfo.email.split('@')[0] || 'کاربر';
        const userId = response.data.user?.id;

        setLoggedInUserEmail(userEmail); 
        setDisplayUserName(userName); 
        setLoggedInUserId(userId); 

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUserEmail', userEmail);
        localStorage.setItem('displayUserName', userName);
        localStorage.setItem('loggedInUserId', String(userId)); 
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
    setLoggedInUserId(null); 
    setIsLogin(true);
    setPersonalInfo(initialData);
    setMessage('');
    setError('');

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUserEmail');
    localStorage.removeItem('displayUserName');
    localStorage.removeItem('loggedInUserId');
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
                  <Dashboard 
                    userEmail={loggedInUserEmail} 
                    userName={displayUserName} 
                    onLogout={handleLogout} 
                    loggedInUserId={loggedInUserId} 
                  />
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
            <Route 
              path="/content/:id" 
              element={
                isLoggedIn ? <DetailPage loggedInUserId={loggedInUserId} /> : <Navigate to="/" /> 
              } 
            />
            <Route 
              path="/favorites" 
              element={
                isLoggedIn ? <FavoritesPage loggedInUserId={loggedInUserId} /> : <Navigate to="/" /> 
              } 
            />
            <Route 
              path="/watchlist" 
              element={
                isLoggedIn ? <WatchlistPage loggedInUserId={loggedInUserId} /> : <Navigate to="/" /> // New route for WatchlistPage
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
