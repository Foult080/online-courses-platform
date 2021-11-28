require("dotenv").config();
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { checkAuth } = require("../middleware/auth");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Sentry = require("@sentry/node");

/**
 * * Authenticate user and send token
 * @param email
 * @param password
 */
router.post(
  "/",
  [
    check("email", "Укажите корректный адрес электронной почты").isEmail(),
    check("password", "Укажите верный пароль").not().isEmpty().exists(),
  ],
  async (req, res) => {
    //check errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //get data from req
    const { email, password } = req.body;
    try {
      //check user
      let user = await User.findOne({ email });
      if (!user) {
        res
          .status(401)
          .json({ errors: [{ msg: "Неверные данные", variant: "danger" }] });
      }

      //check pass
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Неверные данные", variant: "danger" }] });
      }

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
        { expiresIn: 21600 },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );
    } catch (error) {
      Sentry.captureException(error);
      res.status(500).send("Ошибка сервера");
    }
  }
);

/**
 * * Send user data from database
 */
router.get("/", checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    Sentry.captureException(error);
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
