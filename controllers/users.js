require('dotenv').config();
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const Sentry = require('@sentry/node');
const nodemailer = require('nodemailer');

/**
 * Add user
 * @param {string} name - user name
 * @param {email} email - user email
 * @returns {object} token
 */
const adduser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //check email
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'Пользователь уже зарегистрирован', variant: 'danger' }] });
    }
    //add avatar
    const avatar = gravatar.url(email, { s: '200' });
    //create user obj
    user = new User({ name, email, avatar, password });
    //hash pass
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    //save user
    await user.save();
    //gen token
    const payload = {
      user: { id: user.id, role: user.role },
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (error, authToken) => {
      if (error) throw error;
      return res.json({ authToken });
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).send('Ошибка сервера');
  }
};

/**
 * Delete user route
 */
const deleteUser = async (req, res) => {
  try {
    //get data from req
    const userID = req.params.id;
    const role = req.user.role;
    // get userData from db
    const userData = await User.findOne({ _id: userID });
    // check user exists
    if (!userData) return res.status(404).json({ status: 'error', msg: 'Пользователь не найден' });
    // check grants and response
    if (userID === req.user.id || role === 'admin') {
      await userData.remove();
      return res.status(200).json({ status: 'succes', msg: 'Пользователь был успешно удалён' });
    } else res.status(403).json({ status: 'error', msg: 'У вас нет прав для удаления пользователя' });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).send('Ошибка сервера');
  }
};

/**
 * Restore user password
 */
const sendRestoreEmail = async (req, res) => {
  //get data drom req
  const { email } = req.body;
  try {
    //check existing email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'Пользователь не найден', variant: 'danger' }] });
    }
    user.restore = true;
    await user.save();
    // create smpt transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD,
      },
    });
    //send email
    const url = process.env.DOMAIN;
    transporter.sendMail({
      from: 'foult080@kraskrit.ru',
      to: email,
      subject: 'Восстановление пароля',
      html: `<h1>Здравcтвуйте, спасибо что обратились в поддержку.</h1><p>Перейдите по следующей ссылке для восстановления пароля: <a href='${url}/restore/${user.id}'>Нажмите сюда</a></p>`,
    });
    //send message to client
    res.status(200).json({ status: 'success', msg: 'Ссылка для восстановления пароля отправлена на вашу почту' });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ errors: [{ msg: 'Ошибка сервера' }] });
  }
};

//TODO: add restore user

//TODO: add verification user

module.exports = { adduser, deleteUser, sendRestoreEmail };
