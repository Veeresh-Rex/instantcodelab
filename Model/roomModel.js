const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  labname: {
    type: String,
    required: [true, 'A room must have a name'],
  },
  adminCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },

  password: {
    type: String,
    minlength: [
      3,
      'A password should be greater than or equal to eight characters',
    ],
  },
  createdBy: {
    type: String,
    required: [true, 'A room must have a By'],
  },
  languageId: {
    type: Number,
  },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
