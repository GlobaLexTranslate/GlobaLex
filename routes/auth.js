const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// POST /register
router.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('User registered:', { name, email, hashedPassword });
    res.status(201).send('User registered successfully');
});

// POST /login
router.post('/api/login', async (req, res) => {
    // Placeholder for authentication logic
    console.log('User login attempt:', req.body);
    res.send('Login successful');
});

module.exports = router;
