const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  chatId: {
    type: String,
  },
  participants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
},
{ versionKey: false });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
