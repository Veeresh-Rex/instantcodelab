const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
