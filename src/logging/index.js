const winston = require('winston');
const config = require('config');
const path = require('path');

const env = config.util.getEnv('NODE_ENV');
const logDir = config.get('app.logsFilePath');
const loggerLevel = (env === 'dev' || env === 'localhost') ? 'debug' : 'info';
const logger = winston.createLogger({
  level: loggerLevel,
  format: winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
  ],
});

if (env != 'prod'){
  logger.add(
    new winston.transports.Console({ format: winston.format.simple(), level: loggerLevel })
  )
}

module.exports = logger;
