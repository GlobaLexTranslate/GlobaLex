const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();
const port = 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use authentication routes
app.use(authRoutes); 

// Redirect root URL to Login.html
app.get('/', (req, res) => {
    res.redirect('/Login.html');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
