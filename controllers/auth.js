require('dotenv').config();
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Sentry = require('@sentry/node');

/**
 * Authenticate user and send token
 * @param {string} email - user email
 * @param {string} password - user password
 */
const authenticateUser = async (req, res) => {
  //get data from req
  const { email, password } = req.body;
  try {
    //check user exist
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 'error', errors: [{ msg: 'Неверные данные', variant: 'danger' }] });
    }
    //check user password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ errors: [{ msg: 'Неверные данные', variant: 'danger' }] });
    }
    //gen token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };
    // server response
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 21600 }, (error, token) => {
      if (error) throw error;
      return res.json({ authToken: token });
    });
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    res.status(500).send('Ошибка сервера');
  }
};

/**
 * get my profile data
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -restore');
    if (!user) return res.status(404).json({ status: 'error', msg: 'Пользователь в системе не найден' });
    return res.json(user);
  } catch (err) {
    console.log(err);
    Sentry.captureException(err);
    res.status(500).send('Ошибка сервера');
  }
};

module.exports = { authenticateUser, getMe };
