// routes/balance.js
const express = require('express');
const router = express.Router();
const Balance = require('../models/Balance');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id; // From token
    const balance = await Balance.findOne({ userId });

    if (!balance) {
      return res.status(404).json({ message: 'Balance not found' });
    }

    res.json({ balance: balance.amount });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
