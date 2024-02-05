// App.js

import React, { useState } from 'react';
import LandingPage from './components/LandingPage/LandingPage';
import CallPage from './components/CallPage/CallPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginClick = () => {
    setIsLoggedIn(true);
  };

  const handleLogoutClick = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/2567169_370772-PBMRLG-337.jpg)` }}>
      {isLoggedIn ? (
        <CallPage onLogoutClick={handleLogoutClick} />
      ) : (
        <LandingPage onLoginClick={handleLoginClick} />
      )}
    </div>
  );
};

export default App;