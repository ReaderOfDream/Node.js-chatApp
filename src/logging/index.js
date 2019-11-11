const winston = require('winston');
const config = require('config');

const loggerLevel = config.util.getEnv('NODE_ENV') === 'dev' ? 'debug' : 'info';
const logger = winston.createLogger({
  level: loggerLevel,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
  ),
  expressFormat: true,
  colorize: false,
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({ format: winston.format.simple(), level: loggerLevel }),
  ],
});

module.exports = logger;
