const config = require('config');
const path = require('path');
const Service = require('./file-service');
const logger = require('../logging');

const getFile = async (req, res) => {
  const { name } = req.params;

  const file = await Service.getFile(name);

  const filePath = config.get('app.uploadsFilePath');

  res.download(path.join(filePath, file.origName));
};

const uploadFile = async (req, res) => {
  const { file, user } = req;

  const createdFile = await Service.createFile(file);

  logger.info(`user ${user.name} has saved file ${createdFile.origName}`);

  res.status(200).send(createdFile.name);
};

module.exports = {
  getFile,
  uploadFile,
};
