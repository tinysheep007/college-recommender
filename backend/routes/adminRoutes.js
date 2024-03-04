const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db'); // Adjusted path

// Get all admins route
router.get('/getAll', (req, res) => {
    // Query the database to get all admin accounts
    db.query('SELECT * FROM admins', (err, results) => {
        if (err) {
            console.error('Error fetching admins:', err);
            res.status(500).json({ error: 'Failed to fetch admins' });
        } else {
            res.json(results);
        }
    });
});

// Admin login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query the database to find the admin
    db.query('SELECT * FROM admins WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error('Error fetching admin:', err);
        res.status(500).json({ error: 'Failed to fetch admin' });
      } else {
        if (results.length > 0) {
          const admin = results[0];
          // Compare passwords
          if (password === admin.password) {
            // Passwords match
            res.json({ success: true });
          } else {
            // Passwords don't match
            res.status(401).json({ error: 'Invalid username or password',  success: false });
          }
        } else {
          // Admin not found
          res.status(401).json({ error: 'Invalid username or password',  success: false });
        }
      }
    });
  });


// Admin registration route
router.post('/register', (req, res) => {
    const { username, password, adminKey } = req.body;
    
     // check for admin key or else can't register 
     if (adminKey != "key"){
      res.status(400).json({ error: 'Invalid admin key. Contact project admin for the key.' });
      return 
    }

    // Check if the username already exists
    db.query('SELECT * FROM admins WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error('Error checking username:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        if (results.length > 0) {
          // Username already exists
          res.status(400).json({ error: 'Username already exists' });
        } else {
          // Insert admin details into the database
          db.query('INSERT INTO admins (username, password) VALUES (?, ?)', [username, password], (err, results) => {
            if (err) {
              console.error('Error registering admin:', err);
              res.status(500).json({ error: 'Failed to register admin' });
            } else {
              res.json({ success: true });
            }
          });
        }
      }
    });
  });

module.exports = router;
