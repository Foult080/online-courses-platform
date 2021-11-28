require("dotenv").config();
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const Sentry = require("@sentry/node");
const nodemailer = require("nodemailer");
const {checkAuth} = require("../middleware/auth");

/**
 * * Register new user
 * @param name
 * @param email
 * @param password
 */
router.post(
  "/",
  [
    check("name", "Укажите имя").not().isEmpty(),
    check("email", "укажите корректный email адрес").isEmail(),
    check("password", "Укажите пароль длинной более 8 символов!").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    //validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      //check email
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: [
            { msg: "Пользователь уже зарегистрирован", variant: "danger" },
          ],
        });
      }
      //add avatar
      const avatar = gravatar.url(email, {
        s: "200",
      });

      //create user obj
      user = new User({
        name,
        email,
        avatar,
        password,
        role: "user",
      });

      //hash pass
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      //save user
      await user.save();
      //gen token
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 36000 },
        (error, token) => {
          if (error) throw error;
          return res.json({ token });
        }
      );
    } catch (error) {
      Sentry.captureException(error);
      res.status(500).send("Ошибка сервера");
    }
  }
);

//TODO: delete user route
/**
 * * Restore user
 * @params email
 */
router.put(
  "/restore",
  [
    check("email", "Укажите пользователя базы данных")
      .not()
      .isEmpty()
      .isEmail(),
  ],
  async (req, res) => {
    //validate req
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //get data drom req
    const { email } = req.body;

    try {
      //check existing email
      let user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({
          errors: [{ msg: "Пользователь не найден", variant: "danger" }],
        });
      } else {
        const transporter = nodemailer.createTransport({
          host: "smtp.yandex.ru",
          port: 465,
          secure: true,
          auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASSWORD,
          },
        });
        //send email
        transporter.sendMail({
          from: "foult080@kraskrit.ru",
          to: email,
          subject: "Восстановление пароля",
          html: `<h1>Здравтсвуйте, спасибо что обратились в поддержку.</h1><p>Перейдите по следующей ссылке для восстановления пароля: www.some-url.com/restore/${data.id}</p>`,
        });
        //send message to client
        res.status(200).json({
          msg: "Ссылка для восстановления пароля отправлена на вашу почту",
          variant: "success",
        });
      }
    } catch {
      Sentry.captureException(error);
      res.status(500).json({ errors: [{ msg: "Ошибка сервера" }] });
    }
  }
);

/**
 * * Delete user by id
 * @params id
 */
router.delete("/:id", checkAuth, async (req, res) => {
  const id = req.params.id;
  try {
    let user = await User.findById(id);
    if (user.id == req.user.id) {
      await user.remove();
      res.status(200).json({
        msg: "Ваш аккаунт был удалён",
        variant: "info",
      });
    } else {
      res.status(401).json({
        msg: "У вас нет прав для удаления этой записи",
        variant: "danger",
      });
    }
  } catch {
    Sentry.captureException(error);
    res.status(500).json({ errors: [{ msg: "Ошибка сервера" }] });
  }
});

module.exports = router;
