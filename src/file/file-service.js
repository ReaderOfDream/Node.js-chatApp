const { model } = require('./file-model');
const { EntityNotFoundException } = require('../errors/exceptions');

const getFile = async (name) => {
  const file = await model.findOne({ name });
  if (!file) {
    throw new EntityNotFoundException(`File with name=${name} not found.`);
  }
  return file;
};

const createFile = async (file) => {
  const createdFile = await model.create({
    origName: file.originalname,
    path: file.path,
    name: file.filename,
  });

  return createdFile;
};

module.exports = {
  getFile,
  createFile,
};
