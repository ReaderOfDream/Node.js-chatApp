const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    unique: false,
  },
  color: {
    type: String,
  },
},
{ versionKey: false });

const User = mongoose.model('User', userSchema);

module.exports = User;
