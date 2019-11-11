const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('config');
const morgan = require('morgan');

const flash = require('connect-flash');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(expressSession);

const routes = require('../routes');

const passport = require('../middleware/passport');
const logger = require('../logging');

const dbUrl = config.get('db.url');

mongoose.set('useCreateIndex', true);

const connectDb = (onSuccessCallback) => {
  mongoose.connect(dbUrl, { useNewUrlParser: true }, err => onSuccessCallback(err, dbUrl));
};

const session = expressSession({
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  secret: config.get('app.cookieSecret'),
  resave: false,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
  },
});

let configuredMorgan;
if (process.env.DEBUG) {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  configuredMorgan = require('morgan-debug')('app', 'combined');
} else {
  // configuredMorgan = morgan('combined', { stream: logger.stream });
  configuredMorgan = morgan(config.util.getEnv('NODE_ENV'));
}

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(configuredMorgan);
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());
app.use(session);
app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  logger.error(err.message);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = { app, session, connectDb };
