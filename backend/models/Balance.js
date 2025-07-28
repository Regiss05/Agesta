const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  },
  amount: {
    type: Number,
    default: 1000,
  },
});

module.exports = mongoose.model('Balance', balanceSchema);
