require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const authRoutes = require('./routes/auth');
const cookieSession = require('cookie-session');
const cors = require('cors'); // Make sure to install with npm install cors
const path = require('path');

const app = express();
const port = 3000;

app.use(cors()); // Use CORS to avoid cross-origin issues
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/GlobaLex')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

  app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_COOKIE_KEY]
  }));
  
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Set up routes
  app.use('/auth', authRoutes);
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Login.html'));
  });
  
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
