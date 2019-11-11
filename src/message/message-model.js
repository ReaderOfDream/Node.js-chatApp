const mongoose = require('mongoose');

const file = require('../file/file-model');

const messageSchema = new mongoose.Schema({
  from: {
    type: String,
  },
  color: {
    type: String,
  },
  file: file.scheme,
  dateTime: {
    type: Date,
  },
  message: {
    type: String,
  },
  roomId: {
    type: String,
  },
},
{ versionKey: false });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
