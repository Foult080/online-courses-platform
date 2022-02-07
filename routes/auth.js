require('dotenv').config();
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validate } = require('../middleware/validate');
const { checkAuth } = require('../middleware/auth');
const { authenticateUser, getMe } = require('../controllers/auth');

/**
 * Authenticate user and send token
 */
router.post(
  '/',
  [
    check('email', 'Укажите корректный адрес электронной почты').isEmail(),
    check('password', 'Укажите верный пароль').not().isEmpty().exists(),
  ],
  validate,
  authenticateUser
);

/**
 * Send user data from database
 */
router.get('/', checkAuth, getMe);

module.exports = router;
