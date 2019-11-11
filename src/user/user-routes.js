const express = require('express');
const { check } = require('express-validator');
const asyncHandler = require('../helpers/asyncHandler');
const userController = require('./user-controller');

const router = express.Router();

router.route('/login')
  .get(userController.showLoginPage)
  .post(
    asyncHandler(userController.login),
  );

router.route('/logout')
  .get(userController.logout);

router.route('/register')
  .get(userController.showRegister)
  .post([
    check('email').isEmail().normalizeEmail().withMessage('must be valid email'),
    check('pass')
      .trim(' ')
      .isLength({ min: 5 }).withMessage('must be at least 5 non-space symbols'),
  ], asyncHandler(userController.createUser));

module.exports = router;
