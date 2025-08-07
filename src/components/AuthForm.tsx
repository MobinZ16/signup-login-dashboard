import React, { useState } from "react";
import axios from "axios";
import type { PersonalInfo, PersonalInfoErrors } from "../type"; 

interface AuthFormProp {
  personalInfo: PersonalInfo;
  onUpdate: (info: PersonalInfo) => void;
  onSubmit: (isLogin: boolean) => void;
  isLogin: boolean;
  toggleForm: () => void;
  message: string;
  error: string;
}

const AuthForm: React.FC<AuthFormProp> = ({
  personalInfo,
  onUpdate,
  onSubmit,
  isLogin,
  toggleForm,
  message,
  error,
}) => {
  const [validationErrors, setValidationErrors] = useState<PersonalInfoErrors>({});

  const validate = () => {
    let newErrors: PersonalInfoErrors = {};

    // Only validate userName for signup
    if (!isLogin && !personalInfo.userName.trim()) {
      newErrors.userName = "This field is required.";
    }
    
    if (!personalInfo.email.trim()) {
      newErrors.email = "This field is required.";
    } else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
      newErrors.email = "Invalid email format.";
    }
    
    if (!personalInfo.password.trim()) {
      newErrors.password = "This field is required.";
    } else if (personalInfo.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(personalInfo.password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(personalInfo.password)) {
      newErrors.password = "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(personalInfo.password)) {
      newErrors.password = "Password must contain at least one number.";
    }

    // Only validate confirmPassword for signup
    if (!isLogin && !personalInfo.confirmPassword) {
      newErrors.confirmPassword = "This field is required.";
    } else if (!isLogin && personalInfo.confirmPassword !== personalInfo.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...personalInfo, [name]: value });

    // Clear error for the specific field as user types
    if (validationErrors[name as keyof PersonalInfoErrors]) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name as keyof PersonalInfoErrors]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(isLogin);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl border border-gray-700 backdrop-filter backdrop-blur-sm">
      <h2 className="text-3xl font-extrabold text-center text-[#09f]">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>
      
      {/* Add noValidate to the form tag */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Username field only for Sign Up */}
        {!isLogin && (
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              id="userName"
              type="text"
              name="userName"
              value={personalInfo.userName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${validationErrors.userName ? "border-red-500" : "border-gray-600"} bg-gray-800 text-white rounded-lg shadow-sm focus:ring-[#09f] focus:border-[#09f] transition duration-200 ease-in-out`}
              required={!isLogin}
            />
            {validationErrors.userName && <p className="mt-1 text-xs text-red-400">{validationErrors.userName}</p>}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            id="email"
            type="text"
            name="email"
            value={personalInfo.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${validationErrors.email ? "border-red-500" : "border-gray-600"} bg-gray-800 text-white rounded-lg shadow-sm focus:ring-[#09f] focus:border-[#09f] transition duration-200 ease-in-out`}
            required
          />
          {validationErrors.email && <p className="mt-1 text-xs text-red-400">{validationErrors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={personalInfo.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${validationErrors.password ? "border-red-500" : "border-gray-600"} bg-gray-800 text-white rounded-lg shadow-sm focus:ring-[#09f] focus:border-[#09f] transition duration-200 ease-in-out`}
            required
          />
          {validationErrors.password && <p className="mt-1 text-xs text-red-400">{validationErrors.password}</p>}
        </div>
        
        {/* Confirm Password field only for Sign Up */}
        {!isLogin && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={personalInfo.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${validationErrors.confirmPassword ? "border-red-500" : "border-gray-600"} bg-gray-800 text-white rounded-lg shadow-sm focus:ring-[#09f] focus:border-[#09f] transition duration-200 ease-in-out`}
              required={!isLogin}
            />
            {validationErrors.confirmPassword && <p className="mt-1 text-xs text-red-400">{validationErrors.confirmPassword}</p>}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-[#09f] rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#09f] transition duration-200 ease-in-out font-semibold text-lg"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      
      {message && <p className="mt-4 text-sm text-green-400 text-center">{message}</p>}
      {error && <p className="mt-4 text-sm text-red-400 text-center">{error}</p>}

      <div className="mt-6 text-center">
        <button
          onClick={toggleForm}
          className="text-sm font-medium text-[#09f] hover:text-opacity-80 transition duration-200 ease-in-out"
        >
          {isLogin ? 'Don\'t have an account? Sign up' : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
