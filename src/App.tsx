import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import MoviesPage from "./components/MoviesPage"; 
import SeriesPage from "./components/SeriesPage"; 
import DetailPage from "./components/DetailPage";
import FavoritesPage from "./components/FavoritesPage"; // Import the new FavoritesPage
import WatchlistPage from "./components/WatchListPage";
import ContinueWatchingPage from "./components/ContinueWatchingList";
import TrendingPage from "./components/TrendingPage";
import ContentCard from "./components/content/ContentCard";
import Pattern from "./components/Pattern";
import type { PersonalInfo } from "./type";
import axios from "axios";
import './index.css';
//import { type UserDashboardData } from './mockData'; 

const initialData: PersonalInfo = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const App: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(initialData);
  const [isLogin, setIsLogin] = useState(true); // Controls AuthForm mode (login or signup)
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [loggedInUserEmail, setLoggedInUserEmail] = useState(''); 
  const [displayUserName, setDisplayUserName] = useState(''); 
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  // New state to control visibility of AuthForm as an overlay
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);

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
        setShowAuthOverlay(false); // Close overlay on successful login

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUserEmail', userEmail);
        localStorage.setItem('displayUserName', userName);
        localStorage.setItem('loggedInUserId', String(userId)); 
      } else if (!isLoginForm && response.status === 201) {
        // If signup is successful, automatically switch to login form
        setIsLogin(true); 
        setMessage("ثبت‌نام موفقیت‌آمیز بود! اکنون می‌توانید وارد شوید.");
        // Do NOT close overlay, let user login
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
    setIsLogin(true); // Reset to login form for next auth attempt
    setPersonalInfo(initialData);
    setMessage('');
    setError('');

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUserEmail');
    localStorage.removeItem('displayUserName');
    localStorage.removeItem('loggedInUserId');
  };

  const toggleAuthMode = useCallback(() => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
    setPersonalInfo(initialData); // Clear form fields
    setMessage('');
    setError('');
  }, []);

  // Function to open the AuthForm overlay
  const openAuthOverlay = useCallback((mode: 'login' | 'signup') => {
    setIsLogin(mode === 'login');
    setShowAuthOverlay(true);
    setMessage('');
    setError('');
    setPersonalInfo(initialData); // Clear form fields when opening
  }, []);

  // Function to close the AuthForm overlay
  const closeAuthOverlay = useCallback(() => {
    setShowAuthOverlay(false);
    setMessage('');
    setError('');
    setPersonalInfo(initialData); // Clear form fields when closing
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen flex flex-col justify-center items-center p-4"> 
        <Pattern /> 

        {/* AuthForm Overlay - Added backdrop-blur-md here */}
        {showAuthOverlay && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-filter backdrop-blur-md"> {/* Added backdrop-blur-md */}
            <div className="relative">
              <button
                onClick={closeAuthOverlay}
                className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl font-bold z-50"
                aria-label="Close"
              >
                &times;
              </button>
              <AuthForm
                personalInfo={personalInfo}
                onUpdate={handleUpdate}
                onSubmit={handleSubmit}
                isLogin={isLogin}
                toggleForm={toggleAuthMode} // Use toggleAuthMode for switching login/signup
                message={message}
                error={error}
              />
            </div>
          </div>
        )}

        <div className="z-10 w-full h-full flex justify-center items-center">
          <Routes>
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" />} // Default to dashboard
            />
            <Route 
              path="/dashboard" 
              element={
                <Dashboard 
                  userEmail={loggedInUserEmail} 
                  userName={displayUserName} 
                  onLogout={handleLogout} 
                  loggedInUserId={loggedInUserId}
                  isLoggedIn={isLoggedIn} // Pass isLoggedIn state
                  openAuthOverlay={openAuthOverlay} // Pass function to open auth overlay
                />
              } 
            />
            {/* These routes now require login to access, if not logged in, they navigate to dashboard */}
            <Route 
              path="/movies" 
              element={
                isLoggedIn ? <MoviesPage loggedInUserId={loggedInUserId} /> : <Navigate to="/dashboard" /> 
              } 
            />
            <Route 
              path="/series" 
              element={
                isLoggedIn ? <SeriesPage loggedInUserId={loggedInUserId} /> : <Navigate to="/dashboard" /> 
              } 
            />
            <Route 
              path="/content/:id" 
              element={
                isLoggedIn ? <DetailPage loggedInUserId={loggedInUserId} /> : <Navigate to="/dashboard" /> 
              } 
            />
            <Route 
              path="/favorites" 
              element={
                isLoggedIn ? <FavoritesPage loggedInUserId={loggedInUserId} /> : <Navigate to="/dashboard" /> 
              } 
            />
            <Route 
              path="/watchlist" 
              element={
                isLoggedIn ? <WatchlistPage loggedInUserId={loggedInUserId} /> : <Navigate to="/dashboard" /> 
              } 
            />
            <Route 
              path="/continue-watching" 
              element={
                isLoggedIn ? <ContinueWatchingPage loggedInUserId={loggedInUserId} /> : <Navigate to="/dashboard" /> 
              } 
            />
            <Route 
              path="/trending" 
              element={
                isLoggedIn ? <TrendingPage loggedInUserId={loggedInUserId} /> : <Navigate to="/dashboard" /> 
              } 
            />
            {/* Catch-all route for any undefined paths */}
            <Route path="*" element={<Navigate to="/dashboard" />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
