const express = require('express');
const User = require('../models/User');

const router = express.Router();

// GET /api/users/search?query=abc
router.get('/search', async (req, res) => {
  const query = req.query.query;

  if (!query || query.length < 2) {
    return res.status(400).json({ message: 'Query parameter is required and should be at least 2 characters' });
  }

  try {
    // Search users with username starting with query (case-insensitive)
    const users = await User.find({ username: { $regex: '^' + query, $options: 'i' } })
      .limit(10) // limit results to 10
      .select('username -_id'); // select only username, exclude _id

    // Map to array of usernames only
    const usernames = users.map(user => user.username);

    res.json(usernames);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/all
router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('username -_id');
    const usernames = users.map(user => user.username);
    res.json(usernames);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
