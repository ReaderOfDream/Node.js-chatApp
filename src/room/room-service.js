const Room = require('./room-model');
const { EntityNotFoundException } = require('../errors/exceptions');

const getRooms = async () => {
  const rooms = await Room.find().populate('participants');
  return rooms;
};

const getRoom = async (roomId) => {
  const room = await Room.findOne({ name: roomId });
  if (room == null) {
    throw new EntityNotFoundException(`Entity Room with id=${roomId} not found.`);
  }
  return room;
};

const createRoom = async (name) => {
  const room = await Room.create({
    name,
  });

  return room;
};

const deleteRoom = async (name) => {
  await Room.deleteOne({
    name,
  });
};

module.exports = {
  getRooms,
  getRoom,
  createRoom,
  deleteRoom,
};
