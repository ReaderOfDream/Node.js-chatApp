// eslint-disable-next-line import/no-mutable-exports
let socket = null;

const initSocket = (io, roomName, addMessage, onTyping, onDisconnect) => {
  socket = io({
    transports: ['websocket'],
  });

  socket.on('reconnect_attempt', () => {
    socket.io.opts.transports = ['polling', 'websocket'];
  });

  socket.emit('room', roomName);

  socket.on('message', (msg) => {
    // convert from string to DateTime
    // eslint-disable-next-line no-param-reassign
    msg.dateTime = new Date(msg.dateTime);
    addMessage(msg);
  });

  socket.on('disconnect', () => {
    onDisconnect();
  });

  socket.on('typing', msg => onTyping(msg));
};

export { initSocket, socket };
