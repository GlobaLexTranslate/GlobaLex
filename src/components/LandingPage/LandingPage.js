// LandingPage.js

import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onLoginClick }) => {
  const handleEmailClick = () => {
    console.log('Email button clicked');
  };

  const handlePasswordClick = () => {
    console.log('Password button clicked');
  };

  const handleSignInClick = () => {
    console.log('Sign In button clicked');
  };

  return (
    <div className="landing-page">
      <img src="/logo.png" alt="Logo" className="logo" />
      <div className="welcome-text">Hello there!</div>
      <div className="login-box">
        <div className="login-title">LOGIN</div>
        <button onClick={handleEmailClick}>Email</button>
        <button onClick={handlePasswordClick}>Password</button>
        <button onClick={handleSignInClick}>Sign In</button>
      </div>
    </div>
  );
};

export default LandingPage;