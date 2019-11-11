const Model = require('./message-model');

const getMessages = async (roomId, lastMessageDate) => {
  const messages = await Model.find({
    roomId,
    dateTime: {
      $lt: new Date(lastMessageDate).toISOString(),
    },
  }, null, {
    limit: 10,
    sort: '-dateTime',
  });
  return messages;
};

module.exports = {
  getMessages,
};
