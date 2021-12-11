const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const Sentry = require("@sentry/node");
const Request = require("../models/Requests");
const { checkAuth, checkAdmin } = require("../middleware/auth");
const validate = require("../middleware/validate");

/**
 * * Add request
 * @params name, request, contact
 */
router.post(
  "/",
  [
    check("name", "Укажите ваше имя").not().isEmpty(),
    check("request", "укажите корректный email адрес").isEmail(),
  ],
  validate,
  async (req, res) => {
    try {
      const { name, request, contact } = req.body;
      let request = new Request({ name, request, contact });
      await request.save();
      return res.status(200).json({
        msg: `Ваше обращение было сохранено`,
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      Sentry.captureException(err);
      res.status(500).json({ errors: [{ msg: "Ошибка сервера" }] });
    }
  }
);

/**
 * * Get all requests
 */
router.get("/", checkAuth, checkAdmin, async (req, res) => {
  try {
    let requests = Request.find();
    res.json(requests);
  } catch (err) {
    console.log(err);
    Sentry.captureException(err);
    res.status(500).json({ errors: [{ msg: "Ошибка сервера" }] });
  }
});

/**
 * * Resolve request
 * @params id
 */
router.put("/:id", checkAuth, checkAdmin, async (req, res) => {
  try {
    let id = req.params.id;
    let request = Request.findById(id);
    if (request) {
      request.resolve = true;
      request.save();
      return res.status(200).json({
        msg: `Обращение было закрыто`,
        variant: "success",
      });
    } else
      return res
        .status(404)
        .json({ errors: [{ msg: "Запись не найдена", variant: "danger" }] });
  } catch (err) {
    console.log(err);
    Sentry.captureException(err);
    res.status(500).json({ errors: [{ msg: "Ошибка сервера" }] });
  }
});

module.exports = router;
