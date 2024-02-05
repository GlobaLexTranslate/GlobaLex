// index.js

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';// You can create and import this file for global styles
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to measure performance, you can uncomment the lines below
// Learn more about measuring performance: https://bit.ly/CRA-vitals
reportWebVitals();