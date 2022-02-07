const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validate } = require('../middleware/validate');
const { checkAuth } = require('../middleware/auth');
const { adduser, deleteUser, sendRestoreEmail } = require('../controllers/users');

//Register new User
router.post(
  '/',
  [
    check('name', 'Укажите имя').not().isEmpty(),
    check('email', 'укажите корректный email адрес').isEmail(),
    check('password', 'Укажите пароль длинной более 8 символов!').isLength({ min: 8 }),
  ],
  validate,
  adduser
);

// restore user data
router.put('/restore-link', [check('email', 'Укажите пользователя базы данных').not().isEmpty().isEmail()], validate, sendRestoreEmail);

// delete user data
router.delete('/:id', checkAuth, deleteUser);

module.exports = router;
