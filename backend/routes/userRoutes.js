const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db'); // Adjusted path

// Get all users route
router.get('/getAll', (req, res) => {
    // Query the database to get all user accounts
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ error: 'Failed to fetch users' });
        } else {
            res.json(results);
        }
    });
});


// User login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Query the database to find the user
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'Failed to fetch user', success: false });
        } else {
            if (results.length > 0) {
                const user = results[0];
                // Compare passwords
                if (password === user.password) {
                    // Passwords match
                    res.json({ success: true });
                } else {
                    // Passwords don't match
                    res.status(401).json({ error: 'Invalid username or password', success: false });
                }
            } else {
                // User not found
                res.status(401).json({ error: 'Invalid username or password', success: false });
            }
        }
    });
  });
  
  // User registration route
router.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    // Check if the username already exists
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Error checking username:', err);
            res.status(500).json({ error: 'Internal server error', success: false });
        } else {
            if (results.length > 0) {
                // Username already exists
                res.status(400).json({ error: 'Username already exists', success: false });
            } else {
                // Insert user details into the database
                db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, results) => {
                    if (err) {
                        console.error('Error registering user:', err);
                        res.status(500).json({ error: 'Failed to register user', success: false });
                    } else {
                        res.json({ success: true });
                    }
                });
            }
        }
    });
  });
  
  

module.exports = router;
