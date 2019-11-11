const { validationResult } = require('express-validator');
const logger = require('../logging');
const passport = require('../middleware/passport');
const Service = require('./user-service');
const sockets = require('../bin/sockets');

const showLoginPage = (req, res) => {
  res.render('login', { title: 'Login', errors: req.flash('error') });
};

const login = (req, res, next) => {
  const passportAuthMiddleware = passport.authenticate('local',
  // eslint-disable-next-line consistent-return
    (err, user) => {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }

      if (req.body.remember_me) {
        const hour = 1000 * 60 * 60;
        req.session.cookie.expires = new Date(Date.now() + hour);
        req.session.cookie.maxAge = hour;
      }

      req.logIn(user, (er) => {
        if (er) { return next(er); }
        return res.redirect('/rooms');
      });
    });

  passportAuthMiddleware(req, res, next);
};

const logout = (req, res, next) => {
  const { user } = req;

  if (!user || !user.id) {
    res.redirect('/login');
  }

  req.session.destroy((err) => {
    if (err) {
      logger.error(err);
      return next(err);
    }

    sockets.removeSessions(user.id);

    return res.redirect('/login');
  });
};

const showRegister = (req, res) => {
  res.render('register', { title: 'Registration' });
};

const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('register', { title: 'Registration', errors: errors.array() });
    return;
  }

  const { email, pass } = req.body;

  if (await Service.checkUserIsExists(email)) {
    res.render('register', { title: 'Registration', errors: [{ param: 'email', msg: 'user is already registered' }] });
    return;
  }

  const user = await Service.createUser(email, pass);

  logger.info(`created ${user.email}`);
  // eslint-disable-next-line no-underscore-dangle, consistent-return
  req.login({ id: user._id, name: user.email, color: user.color }, (err) => {
    if (err) {
      logger.error(`could not login user ${user.email}`, err);
      return next(err);
    }

    res.redirect('/rooms');
  });
};

module.exports = {
  showLoginPage,
  login,
  logout,
  showRegister,
  createUser,
};
