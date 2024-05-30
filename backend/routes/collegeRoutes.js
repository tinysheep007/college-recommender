const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjusted path

// Get all colleges
router.get('/getAll', (req, res) => {
    db.query('SELECT * FROM collegebasics', (err, results) => {
        if (err) {
            console.error('Error fetching colleges:', err);
            res.status(500).json({ error: 'Failed to fetch colleges' });
        } else {
            res.json(results);
        }
    });
});

// Get a single college by id
router.get('/:id', (req, res) => {
    const idCollege = req.params.id;
    db.query('SELECT * FROM collegebasics WHERE idCollege = ?', [idCollege], (err, results) => {
        if (err) {
            console.error('Error fetching college:', err);
            res.status(500).json({ error: 'Failed to fetch college' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'College not found' });
        } else {
            res.json(results[0]);
        }
    });
});

// Search colleges by name
router.get('/search/input', (req, res) => {
    const { searchTerm } = req.query; // Using req.query to get the searchTerm

    if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
    }

    const sql = 'SELECT * FROM collegebasics WHERE collegeName LIKE ?';
    const values = [`%${searchTerm}%`];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error searching colleges:', err);
            return res.status(500).json({ error: 'Failed to search colleges' });
        }

        res.json(results);
    });
});


// search for closest match college based on SAT and GPA
router.get('/search/closest', (req, res) => {
    const { SAT, GPA } = req.query;
    // console.log(SAT)
    // console.log(GPA)

    if (!SAT || !GPA) {
        return res.status(400).json({ error: 'SAT and GPA are required' });
    }

    const userSAT = parseInt(SAT, 10);
    const userGPA = parseFloat(GPA);

    const sql = `
        SELECT *, 
            ABS(aveSAT - ?) / 1600 + ABS(aveGPA - ?) / 4.0 AS closeness
        FROM collegebasics
        ORDER BY closeness ASC
    `;

    db.query(sql, [userSAT, userGPA], (err, results) => {
        if (err) {
            console.error('Error searching colleges:', err);
            return res.status(500).json({ error: 'Failed to search colleges' });
        }

        res.json(results);
    });
});

// search colleges based on range of SAT and GPA
router.get('/search/range', (req, res) => {
    const { minSAT, maxSAT, minGPA, maxGPA } = req.query;

    if (!minSAT || !maxSAT || !minGPA || !maxGPA) {
        return res.status(400).json({ error: 'Minimum and maximum SAT and GPA values are required' });
    }

    const minSATValue = parseInt(minSAT, 10);
    const maxSATValue = parseInt(maxSAT, 10);
    const minGPAValue = parseFloat(minGPA);
    const maxGPAValue = parseFloat(maxGPA);

    const sql = `
        SELECT * 
        FROM collegebasics
        WHERE aveSAT BETWEEN ? AND ?
        AND aveGPA BETWEEN ? AND ?
    `;

    db.query(sql, [minSATValue, maxSATValue, minGPAValue, maxGPAValue], (err, results) => {
        if (err) {
            console.error('Error searching colleges by range:', err);
            return res.status(500).json({ error: 'Failed to search colleges by range' });
        }

        res.json(results);
    });
});


// Create a new college
router.post('/create', (req, res) => {
    const { collegeName, picURL, aveSAT, aveGPA, tuition, accRate, ranks, idCollegeDetails, loc } = req.body;
    
    console.log()

    if (!collegeName){
        res.status(500).json({ error: 'missing college name' });
    }


    db.query('INSERT INTO collegebasics (collegeName, picURL, aveSAT, aveGPA, tuition, accRate, ranks, idCollegeDetails, loc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [collegeName, picURL, aveSAT, aveGPA, tuition, accRate, ranks, idCollegeDetails, loc], 
        (err, results) => {
        if (err) {
            console.error('Error creating college:', err);
            res.status(500).json({ error: 'Failed to create college' });
        } else {
            res.status(201).json({ message: 'College created successfully', id: results.insertId });
        }
    });
});

// Update a college by id
router.put('/:idCollege', (req, res) => {
    const idCollege = req.params.idCollege;
    const fields = req.body;
    
    if (Object.keys(fields).length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }

    let query = 'UPDATE collegebasics SET ';
    const values = [];
    for (const [key, value] of Object.entries(fields)) {
        query += `${key} = ?, `;
        values.push(value);
    }

    // Remove the trailing comma and space
    query = query.slice(0, -2);
    query += ' WHERE idCollege = ?';
    values.push(idCollege);

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error updating college:', err);
            return res.status(500).json({ error: 'Failed to update college' });
        } else if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'College not found' });
        } else {
            return res.json({ success: true, message: 'College updated successfully' });
        }
    });
});



// Delete a college by id
router.delete('/:id', (req, res) => {
    const idCollege = req.params.id;
    db.query('DELETE FROM collegebasics WHERE idCollege = ?', [idCollege], (err, results) => {
        if (err) {
            console.error('Error deleting college:', err);
            res.status(500).json({ error: 'Failed to delete college' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'College not found' });
        } else {
            res.json({ success: true, message: 'College deleted successfully' });
        }
    });
});


// Return all user's liked colleges
router.get('/userLikedColleges/:userId', (req, res) => {
    const userId = req.params.userId;

    // Query to select all liked colleges for the given user ID
    const query = `
        SELECT uc.iduserlikedcolleges, uc.idusers, uc.idCollege, cb.*
        FROM userlikedcolleges uc
        JOIN collegebasics cb ON uc.idCollege = cb.idCollege
        WHERE uc.idusers = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user liked colleges:', err);
            res.status(500).json({ error: 'Failed to fetch user liked colleges' });
        } else if(results.length == 0) {
            res.status(400).json({error : "no liked colleges found for this user"})
        } else {
            res.json(results);
        }
    });
});

// add user's liked/saved college
router.put('/userLikedColleges/:idusers/:idCollege', (req, res) => {
    const idusers = req.params.idusers;
    const idCollege = req.params.idCollege;

    // Check if the user ID exists
    db.query('SELECT idusers FROM users WHERE idusers = ?', [idusers], (err, userResults) => {
        if (err) {
            console.error('Error checking user ID:', err);
            return res.status(500).json({ error: 'Failed to check user ID' });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User ID not found' });
        }

        // Check if the college ID exists
        db.query('SELECT idCollege FROM collegebasics WHERE idCollege = ?', [idCollege], (err, collegeResults) => {
            if (err) {
                console.error('Error checking college ID:', err);
                return res.status(500).json({ error: 'Failed to check college ID' });
            }

            if (collegeResults.length === 0) {
                return res.status(404).json({ error: 'College ID not found' });
            }

            // Check if the user already liked the college
            db.query('SELECT iduserlikedcolleges FROM userlikedcolleges WHERE idusers = ? AND idCollege = ?', [idusers, idCollege], (err, likedResults) => {
                if (err) {
                    console.error('Error checking liked college:', err);
                    return res.status(500).json({ error: 'Failed to check liked college' });
                }

                if (likedResults.length > 0) {
                    return res.status(409).json({ error: 'College already liked by the user' });
                }

                // Insert the new liked college into the userlikedcolleges table
                db.query('INSERT INTO userlikedcolleges (idusers, idCollege) VALUES (?, ?)', [idusers, idCollege], (err, insertResults) => {
                    if (err) {
                        console.error('Error adding liked college:', err);
                        return res.status(500).json({ error: 'Failed to add liked college' });
                    }

                    res.status(201).json({ success: true, message: 'College liked successfully', id: insertResults.insertId });
                });
            });
        });
    });
});

// delete user's liked/saved college
router.delete('/userLikedColleges/:iduserlikedcolleges', (req, res) => {
    const iduserlikedcolleges = req.params.iduserlikedcolleges;
    db.query('DELETE FROM userlikedcolleges WHERE iduserlikedcolleges = ?', [iduserlikedcolleges], (err, results) => {
        if (err) {
            console.error('Error deleting college:', err);
            res.status(500).json({ error: 'Failed to delete college' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'liked/saved college record not found' });
        } else {
            res.json({ message: 'College deleted successfully' });
        }
    });
});




// Get all colleges from collegeinfo
router.get('/collegeinfo/getAll', (req, res) => {
    db.query('SELECT * FROM collegeinfo', (err, results) => {
        if (err) {
            console.error('Error fetching college info:', err);
            res.status(500).json({ error: 'Failed to fetch college info' });
        } else {
            res.json(results);
        }
    });
});

// Get a single college info by id
router.get('/collegeinfo/:id', (req, res) => {
    const idCollege = req.params.id;
    db.query('SELECT * FROM collegeinfo WHERE idCollege = ?', [idCollege], (err, results) => {
        if (err) {
            console.error('Error fetching college info:', err);
            res.status(500).json({ error: 'Failed to fetch college info' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'College info not found' });
        } else {
            res.json(results[0]);
        }
    });
});

// Create a new college info
router.post('/collegeinfo/create', (req, res) => {
    const { academic, value, safety, location, athletics, life, idCollege } = req.body;

    // First, check if the idCollege exists in the collegebasics table
    db.query('SELECT idCollege FROM collegebasics WHERE idCollege = ?', [idCollege], (err, results) => {
        if (err) {
            console.error('Error checking college ID:', err);
            return res.status(500).json({ error: 'Failed to check college ID' });
        }

        if (results.length === 0) {
            // idCollege does not exist in collegebasics table
            return res.status(404).json({ error: 'College ID does not exist in the basics table' });
        }

        // idCollege exists, proceed with the insertion into collegeinfo table
        db.query('INSERT INTO collegeinfo (academic, value, safety, location, athletics, life, idCollege) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [academic, value, safety, location, athletics, life, idCollege],
            (err, results) => {
                if (err) {
                    console.error('Error creating college info:', err);
                    return res.status(500).json({ error: 'Failed to create college info' });
                }
                res.status(201).json({ message: 'College info created successfully', id: results.insertId });
            });
    });
});

// Update college info by id
router.put('/collegeinfo/:idCollege', (req, res) => {
    const idCollege = req.params.idCollege;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }

    let query = 'UPDATE collegeinfo SET ';
    const values = [];
    for (const [key, value] of Object.entries(fields)) {
        query += `${key} = ?, `;
        values.push(value);
    }

    // Remove the trailing comma and space
    query = query.slice(0, -2);
    query += ' WHERE idCollege = ?';
    values.push(idCollege);

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error updating college info:', err);
            return res.status(500).json({ error: 'Failed to update college info' });
        } else if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'College info not found' });
        } else {
            return res.json({ success: true, message: 'College info updated successfully' });
        }
    });
});

// Delete college info by id
router.delete('/collegeinfo/:id', (req, res) => {
    const idCollege = req.params.id;
    db.query('DELETE FROM collegeinfo WHERE idCollege = ?', [idCollege], (err, results) => {
        if (err) {
            console.error('Error deleting college info:', err);
            res.status(500).json({ error: 'Failed to delete college info' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'College info not found' });
        } else {
            res.json({ success: true, message: 'College info deleted successfully' });
        }
    });
});


// Get all comments for a college
router.get('/collegecomment/:id', (req, res) => {
    const idCollege = req.params.id;
    db.query('SELECT * FROM collegecomments WHERE idcollege = ?', [idCollege], (err, results) => {
        if (err) {
            console.error('Error fetching comments:', err);
            res.status(500).json({ error: 'Failed to fetch comments' });
        } else {
            res.json(results);
        }
    });
});

// Create a new comment
router.post('/collegecomment/create', (req, res) => {
    const { idusers, idCollege, message } = req.body;

    // Check if the college ID exists
    db.query('SELECT idCollege FROM collegebasics WHERE idCollege = ?', [idCollege], (err, collegeResults) => {
        if (err) {
            console.error('Error checking college ID:', err);
            return res.status(500).json({ error: 'Failed to check college ID' });
        }

        if (collegeResults.length === 0) {
            return res.status(404).json({ error: 'College ID not found' });
        }

        // Insert the new comment into the collegecomments table
        db.query('INSERT INTO collegecomments (idusers, idCollege, message) VALUES (?, ?, ?)', [idusers, idCollege, message], (err, insertResults) => {
            if (err) {
                console.error('Error adding comment:', err);
                return res.status(500).json({ error: 'Failed to add comment' });
            }

            res.status(201).json({ success: true, message: 'Comment added successfully', id: insertResults.insertId });
        });
    });
});

// Update a comment by id
router.put('/collegecomment/:id', (req, res) => {
    const idComment = req.params.id;
    const { message } = req.body;

    db.query('UPDATE collegecomments SET message = ? WHERE idcollegecomments = ?', [message, idComment], (err, results) => {
        if (err) {
            console.error('Error updating comment:', err);
            return res.status(500).json({ error: 'Failed to update comment' });
        } else if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        } else {
            return res.json({ success: true, message: 'Comment updated successfully' });
        }
    });
});

// Delete a comment by id
router.delete('/collegecomment/:id', (req, res) => {
    const idComment = req.params.id;
    db.query('DELETE FROM collegecomments WHERE idcollegecomments = ?', [idComment], (err, results) => {
        if (err) {
            console.error('Error deleting comment:', err);
            res.status(500).json({ error: 'Failed to delete comment' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Comment not found' });
        } else {
            res.json({ success: true, message: 'Comment deleted successfully' });
        }
    });
});


// Get all college decisions
router.get('/collegedecisions/getAll', (req, res) => {
    db.query('SELECT * FROM collegedecisions', (err, results) => {
        if (err) {
            console.error('Error fetching college decisions:', err);
            res.status(500).json({ error: 'Failed to fetch college decisions' });
        } else {
            res.json(results);
        }
    });
});


// Create a new college decision
router.post('/collegedecision', (req, res) => {
    const { idusers, idCollege, SAT, GPA, extra, decision } = req.body;
    const query = 'INSERT INTO collegedecisions (idusers, idCollege, SAT, GPA, extra, decision) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [idusers, idCollege, SAT, GPA, extra, decision], (err, results) => {
        if (err) {
            console.error('Error adding college decision:', err);
            res.status(500).json({ error: 'Failed to add college decision' });
        } else {
            res.json({ success: true, message: 'College decision added successfully', id: results.insertId });
        }
    });
});

// delete route 
router.delete('/collegedecision/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM collegedecisions WHERE idcollegedecisions = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting college decision:', err);
            res.status(500).json({ error: 'Failed to delete college decision' });
        } else {
            res.json({ success: true, message: 'College decision deleted successfully' });
        }
    });
});




module.exports = router;
