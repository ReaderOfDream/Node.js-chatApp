
const Service = require('./message-service');

const getMessages = async (req, res) => {
  const roomId = req.params.id;
  const lastMessageDate = Date.parse(req.query.lastMessageDate) || new Date().toISOString();

  const messages = await Service.getMessages(roomId, lastMessageDate);

  res.send(messages);
};

module.exports = {
  getMessages,
};
