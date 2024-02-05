import React from 'react';
import './CallPage.css';

const CallPage = ({ onLogoutClick }) => {
  return (
    <div className="call-page">
      <div className="navbar">
        <img src="/logo.png" alt="Logo" className="navbar-logo" />
        <span className="navbar-title">GlobaLex</span>
        <button className="logout-button" onClick={onLogoutClick}>
          Logout
        </button>
      </div>
      <div className="call-container">
        <div className="contact-book">Contact Book</div>
        <div className="call-details">
          <div className="call-info">
            <div className="call-name">John Doe</div>
            <button className="call-button">Call</button>
          </div>
          <div className="calling-info">
            <div className="status">Calling...</div>
            <div className="language-info">
              <div>Your Language: English</div>
              <div>Their Language: Spanish</div>
            </div>
            <button className="hang-up-button">Hang Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallPage;