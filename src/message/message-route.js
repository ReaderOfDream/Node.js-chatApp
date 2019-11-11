const express = require('express');
const asyncHandler = require('../helpers/asyncHandler');
const controller = require('./message-controller');

const router = express.Router({ mergeParams: true });

router.get('/', asyncHandler((req, res, next) => controller.getMessages(req, res, next)));

module.exports = router;
