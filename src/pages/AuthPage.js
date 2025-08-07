// src/pages/AuthPage.js - CORRECTED
import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AuthForm from '../components/AuthForm/AuthForm';
import useAuth from '../hooks/useAuth';
import './AuthPage.css';

const AuthPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { login, signup, loading, user, isAuthenticated } = useAuth(); // Get user and isAuthenticated from context
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Use useEffect to redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);


  const handleAuthSubmit = async (formData) => {
    try {
      if (isLoginMode) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData);
      }
      // Navigation is now handled by the useEffect above,
      // which triggers when `user` or `isAuthenticated` changes.
    } catch (err) {
      console.error("AuthPage caught an error:", err.response?.data?.message || err.message);
      // You can set local state to display this specific error in the form
    }
  };

  const toggleModeHandler = () => {
    setIsLoginMode(prevMode => !prevMode);
  };

  // If already authenticated and navigating, don't show the form momentarily
  if (isAuthenticated && user) {
      return null; // Or a small loading spinner if needed
  }


  return (
    <div className="auth-page-container">
      <AuthForm
        isLogin={isLoginMode}
        onSubmit={handleAuthSubmit}
        onToggleMode={toggleModeHandler}
        isLoading={loading}
        // error={error} // If useAuth exposes an error, pass it
      />
    </div>
  );
};

export default AuthPage;