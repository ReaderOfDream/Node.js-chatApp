const express = require('express');
const asyncHandler = require('../helpers/asyncHandler');
const messageRoutes = require('../message/message-route.js');
const roomController = require('./room-controller');

const router = express.Router();

router.route('/')
  .get(asyncHandler((req, res, next) => roomController.getRooms(req, res, next)))
  .post(roomController.validateRoom,
    asyncHandler((req, res, next) => roomController.createRoom(req, res, next)));

router.route('/:id')
  .get(asyncHandler((req, res, next) => roomController.getRoom(req, res, next)))
  .delete(roomController.validateDeleteRoom,
    asyncHandler((req, res, next) => roomController.deleteRoom(req, res, next)));

router.use('/:id/messages', messageRoutes);

module.exports = router;
