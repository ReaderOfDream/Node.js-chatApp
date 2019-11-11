const { check, validationResult } = require('express-validator');
const Service = require('./room-service');

const logger = require('../logging');

const getRooms = async (req, res) => {
  const { user } = req;

  const rooms = await Service.getRooms();

  res.render('lobby', {
    title: `lobby ${user.name}`,
    user: user.name,
    rooms: rooms.map(i => ({
      name: i.name,
      users: (i.participants.length > 0 && i.participants.map(p => p.email)) || [],
    })),
  });
};


const getRoom = async (req, res) => {
  const roomId = req.params.id;
  const { user } = req;

  const room = await Service.getRoom(roomId);

  res.render('room', { title: room.name, user: user.name });
};

const validateRoom = check('name').not().isEmpty()
  .isAlphanumeric()
  .withMessage('must be alphanumeric');

const createRoom = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json(errors);
    return;
  }

  const room = await Service.createRoom(req.body.name);

  logger.log({ level: 'info', message: `created room ${room.name}` });

  res.json(room.name);
};

const validateDeleteRoom = check('id').not().isEmpty().isAlphanumeric();

const deleteRoom = async (req, res) => {
  const { user } = req;
  const roomName = req.params.id;

  await Service.deleteRoom(roomName);

  logger.info(`deleted room ${roomName} by ${user}`);

  res.sendStatus(200);
};

module.exports = {
  getRooms,
  getRoom,
  createRoom,
  validateRoom,
  validateDeleteRoom,
  deleteRoom,
};
