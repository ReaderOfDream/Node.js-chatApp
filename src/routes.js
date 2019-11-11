const express = require('express');
const rootRoutes = require('./user/user-routes');
const fileRoutes = require('./file/file-route');
const roomRoutes = require('./room/room-routes');
const mustAuthenticated = require('./middleware/mustAuthenticated');

const router = express.Router();

router.use('/', (req, res, next) => {
  if (req.url === '/') {
    if (req.isAuthenticated()) {
      return res.redirect('/rooms');
    }

    return res.redirect('/login');
  }

  return next();
}, rootRoutes);

router.use('/rooms', mustAuthenticated, roomRoutes);
router.use('/files', mustAuthenticated, fileRoutes);

module.exports = router;
