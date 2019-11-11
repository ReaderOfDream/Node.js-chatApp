const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  origName: {
    type: String,
  },
  name: {
    type: String,
    unique: true,
    sparse: true,
  },
  path: {
    type: String,
  },
},
{ versionKey: false });

const File = mongoose.model('File', fileSchema);

module.exports = { scheme: fileSchema, model: File };
