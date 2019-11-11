const express = require('express');
const multer = require('multer');
const config = require('config');
const asyncHandler = require('../helpers/asyncHandler');

const fileController = require('./file-controller');

const upload = multer({ dest: config.get('app.uploadsFilePath') });

const router = express.Router();

router.get('/:name', asyncHandler((req, res, next) => fileController.getFile(req, res, next)));

router.post('/', upload.single('file'), asyncHandler((req, res, next) => fileController.uploadFile(req, res, next)));

module.exports = router;
