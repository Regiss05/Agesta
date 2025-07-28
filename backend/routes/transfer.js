const express = require('express');
const User = require('../models/User');
const Balance = require('../models/Balance');
const authMiddleware = require('../middleware/auth');
const Transfer = require('../models/Transfer');

const router = express.Router();

// POST /api/transfer
router.post('/', authMiddleware, async (req, res) => {
  const { recipientUsername, amount } = req.body;

  if (!recipientUsername || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid transfer details.' });
  }

  try {
    const senderId = req.user.id;
    const sender = await User.findById(senderId);
    const recipient = await User.findOne({ username: recipientUsername });

    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found.' });
    }

    if (recipient._id.equals(senderId)) {
      return res.status(400).json({ message: 'You cannot send money to yourself.' });
    }

    // Get or create balances
    const senderBalance =
      (await Balance.findOne({ userId: senderId })) ||
      new Balance({ userId: senderId, amount: 1000 }); // default for new users

    const recipientBalance =
      (await Balance.findOne({ userId: recipient._id })) ||
      new Balance({ userId: recipient._id, amount: 1000 }); // default for new users

    if (senderBalance.amount < amount) {
      return res.status(400).json({ message: 'Insufficient balance.' });
    }

    // Perform transfer
    senderBalance.amount -= amount;
    recipientBalance.amount += amount;

    await senderBalance.save();
    await recipientBalance.save();

    // Log transfer
    const transfer = new Transfer({
      sender: sender._id,
      recipient: recipient._id,
      amount,
    });
    await transfer.save();

    res.status(200).json({ message: 'Transfer successful', newBalance: senderBalance.amount });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/transfer/history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const transfers = await Transfer.find({ sender: req.user._id })
      .sort({ timestamp: -1 })
      .populate('recipient', 'username');

    res.json(transfers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history' });
  }
});

module.exports = router;
