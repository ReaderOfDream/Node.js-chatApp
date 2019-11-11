const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const logger = require('../logging');
const User = require('../user/user-model');

const authStrategy = new LocalStrategy(
  async (username, password, done) => {
    let user = null;
    try {
      user = await User.findOne({ email: username }).exec();
    } catch (e) {
      logger.error(`error while getting user ${username}`, e);
      return done(e);
    }

    logger.info(`auth ${username}`);

    if (!user || !await bcrypt.compare(password, user.password)) {
      return done(null, false, { message: 'wrong email or password' });
    }
    // eslint-disable-next-line  no-underscore-dangle
    return done(null, { id: user._id, name: user.email, color: user.color });
  },
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(authStrategy);

module.exports = passport;
