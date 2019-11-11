const bcrypt = require('bcrypt');
const config = require('config');
const User = require('./user-model');

const saltRounds = config.get('app.saltRounds');

/* eslint-disable no-use-before-define */

const createUser = async (email, pass) => {
  const hash = await bcrypt.hash(pass, saltRounds);

  const user = await User.create({
    email,
    password: hash,
    color: getRandomColor(),
  });

  return user;
};

const checkUserIsExists = async (email) => {
  const existedUser = await User.findOne({ email }).exec();
  return existedUser;
};

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

module.exports = {
  createUser,
  checkUserIsExists,
};
