#!/usr/bin/env node

/* eslint-disable no-use-before-define */

/**
 * Module dependencies.
 */

const { createServer } = require('http');
const config = require('config');
const socket = require('socket.io');
const sharedSession = require('express-socket.io-session');

const { app, session, connectDb } = require('./bin/app');
const sockets = require('./bin/sockets');
const logger = require('./logging');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(config.get('app.port') || 3000);
app.set('port', port);

/**
 * Create HTTP server.
 */

connectDb((mongoError, url) => {
  if (mongoError) {
    logger.error('Could not connect to MongoDB.', mongoError);
    return;
  }

  logger.info(`connected to MongoDB ${url}`);

  const server = createServer(app);
  /**
 * Listen on provided port, on all network interfaces.
 */
  const addr = config.get('app.host');
  server.listen(port, addr);

  /**
   * initialize sockets
   */
  const io = socket.listen(server);
  io.use(sharedSession(session, {
    autoSave: true,
  }));

  sockets.subscribeMessages(io);

  /**
   * Errors handling
   */

  server.on('error', onError);
  server.on('listening', onListening);

  process.on('uncaughtException', (err) => {
    logger.error('uncaught exception', err);
    process.exit(1);
  });

  /**
 * Event listener for HTTP server "error" event.
 */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
 * Event listener for HTTP server "listening" event.
 */

  function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${addr.port}`;
    logger.info(`Listening on ${addr.address}:${bind}`);
  }
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const parsedPort = parseInt(val, 10);

  if (Number.isNaN(parsedPort)) {
  // named pipe
    return val;
  }

  if (parsedPort >= 0) {
  // port number
    return parsedPort;
  }

  return false;
}
