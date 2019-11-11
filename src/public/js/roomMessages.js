/* eslint-disable no-use-before-define */
export const writingUsers = [];
export let writing = false;
let render = null;

const init = (socket, renderTypingUsers) => {
  socket.on('message', (msg) => {
    if (msg.from) {
      removeUser(msg.from);
    }
  });

  render = renderTypingUsers;
};

const onTypingMessage = (msg) => {
  if (writingUsers.length > 0 && writingUsers.indexOf(i => i.user.name === msg.name)) {
    resetTimeout(msg.name);
  } else {
    addUser(msg);
  }
};

const shouldSendTyping = () => {
  if (!writing) {
    writing = true;
    setTimeout(() => { writing = false; }, 2000);
    return true;
  }

  return false;
};

function addUser(user) {
  writingUsers.push({ user, timer: setTimeout(() => removeUser(user.name), 5000) });
  render(writingUsers);
}

function resetTimeout(userName) {
  const user = writingUsers.find(i => i.user.name === userName);
  clearTimeout(user.timer);
  user.timer = setTimeout(() => removeUser(userName), 5000);
}

function removeUser(userName) {
  const userToRemove = writingUsers.findIndex(i => i.user.name === userName);
  if (userToRemove > -1) {
    writingUsers.splice(userToRemove, 1);
  }

  render(writingUsers);
}

export { onTypingMessage, shouldSendTyping, init };
