const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db'); // Adjusted path

// get all notices
router.get('/getAll', (req,res)=>{
    db.query('SELECT * FROM notices', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ error: 'Failed to fetch users' });
        } else {
            res.json(results);
        }
    });
})

// add notices
router.post('/addNotice', (req, res) => {
    const { idadmin, date, title, content } = req.body;

    if (!idadmin || !date || !title || !content) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if idadmin is valid
    db.query('SELECT * FROM admins WHERE idadmin = ?', [idadmin], (err, results) => {
        if (err) {
            console.error('Error verifying admin:', err);
            return res.status(500).json({ error: 'Failed to verify admin' });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid admin ID' });
        }

        // Insert the new notice
        db.query('INSERT INTO notices (title, idadmin, date, content) VALUES (?, ?, ?, ?)', [title, idadmin, date, content], (err, result) => {
            if (err) {
                console.error('Error adding notice:', err);
                return res.status(500).json({ error: 'Failed to add notice' });
            }

            res.status(201).json({ message: 'Notice added successfully', noticeId: result.insertId });
        });
    });
});


// Update notice
router.put('/updateNotice/:idnotice', (req, res) => {
    const { idnotice } = req.params;
    const { idadmin, date, title, content } = req.body;

    if (!idadmin || !date || !title || !content) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if idadmin is valid
    db.query('SELECT * FROM admins WHERE idadmin = ?', [idadmin], (err, results) => {
        if (err) {
            console.error('Error verifying admin:', err);
            return res.status(500).json({ error: 'Failed to verify admin' });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid admin ID' });
        }

        // Update the notice
        db.query('UPDATE notices SET title = ?, idadmin = ?, date = ?, content = ? WHERE idnotice = ?', [title, idadmin, date, content, idnotice], (err, result) => {
            if (err) {
                console.error('Error updating notice:', err);
                return res.status(500).json({ error: 'Failed to update notice' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Notice not found' });
            }

            res.status(200).json({ message: 'Notice updated successfully' });
        });
    });
});

// delete
router.delete('/deleteNotice/:idnotice', (req, res) => {
    const { idnotice } = req.params;

    // Delete the notice
    db.query('DELETE FROM notices WHERE idnotice = ?', [idnotice], (err, result) => {
        if (err) {
            console.error('Error deleting notice:', err);
            return res.status(500).json({ error: 'Failed to delete notice' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Notice not found' });
        }

        res.status(200).json({ message: 'Notice deleted successfully' });
    });
});


module.exports = router;
