const logger = require('../logging');
const Message = require('../message/message-model');
const { model: File } = require('../file/file-model');
const Room = require('../room/room-model');

/* eslint-disable no-use-before-define */

const sockets = { };

const userSocketsMap = new Map();

sockets.subscribeMessages = (io) => {
  io.on('connection', (s) => {
    if (!s.handshake.session || !s.handshake.session.passport) {
      s.emit(new Error('authentication error'));
    }

    const { id, name, color } = s.handshake.session.passport.user;

    if (!userSocketsMap.has(id)) {
      userSocketsMap.set(id, [1].fill(s.id));
    } else {
      userSocketsMap.get(id).push(s.id);
    }

    s.on('room', (roomName) => {
      s.join(roomName);
      Room.updateOne({ name: roomName }, { $addToSet: { participants: id } }).catch(err => logger.error('error', err));
      logger.info(`User <${name}> joined to ${roomName}`);

      s.in(roomName).on('message', ({ text }) => onMessage(text, name, color, roomName, io));
      s.in(roomName).on('file', ({ file }) => onFile(file, name, color, roomName, io));
      s.in(roomName).on('typing', () => onTyping(name, color, roomName, s));

      s.on('disconnect', () => {
        logger.info(`User <${name}> disconnected`);
        Room.updateOne({ name: roomName }, { $pull: { participants: id } }).catch(err => logger.error('error', err));
      });
    });
  });

  sockets.removeSessions = (userId) => {
    const userSockets = userSocketsMap.get(userId);
    if (userSockets) {
      userSockets.forEach((s) => {
        const serverSockets = io.sockets.sockets;
        if (Object.prototype.hasOwnProperty.call(serverSockets, s)) {
          serverSockets[s].disconnect();
        }
      });
    }
  };
};

async function onFile(fileName, userName, color, roomName, io) {
  logger.debug(`User <${userName}> sent file in ${roomName}: ${fileName}`);

  const file = await File.findOne({ name: fileName });

  const created = await Message.create({
    file: {
      origName: file.origName,
      path: file.path,
      name: file.name,
    },
    from: userName,
    color,
    dateTime: Date.now(),
    roomId: roomName,
  });

  io.to(roomName).emit('message', created);
}

async function onMessage(msg, userName, color, roomName, io) {
  logger.debug(`User <${userName}> sent message in ${roomName}: ${msg}`);
  const created = await Message.create({
    message: msg,
    from: userName,
    color,
    dateTime: Date.now(),
    roomId: roomName,
  });

  io.to(roomName).emit('message', created);
}

function onTyping(userName, color, roomName, io) {
  logger.info(`user ${userName} is typing...`);
  io.to(roomName).emit('typing', { name: userName, color });
}

module.exports = sockets;
