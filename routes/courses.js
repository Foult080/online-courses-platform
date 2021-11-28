const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Sentry = require("@sentry/node");
const Course = require("../models/Courses");
const { checkAuth, checkAdmin } = require("../middleware/auth");

/**
 * *Add new course
 * @params title, description, img
 */
router.post(
  "/",
  checkAuth,
  checkAdmin,
  [
    check("title", "Укажите заголовок").not().isEmpty(),
    check("description", "Укажите описание").not().isEmpty(),
  ],
  async (req, res) => {
    //validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, description } = req.body;
      const img = req.files.img;
      if (!img)
        return res.status(400).json({
          errors: [
            { msg: "Добавьте изображения для курса", variant: "danger" },
          ],
        });
      let course = new Course({ title, description });
      img.name = course.id + img.name;
      img.mv("./client_app/public/images/" + img.name);
      course.img = "./client_app/public/images/" + img.name;
      await course.save();
      return res
        .status(200)
        .json({ msg: `Курс ${title}  создан`, variant: "success" });
    } catch (err) {
      Sentry.captureException(err);
      res.status(500).json({ errors: [{ msg: "Ошибка сервера" }] });
    }
  }
);

//TODO change logic
/**
 * *Add lesson to course
 * @params title, description, url
 */
router.post(
  "/add-lesson/:id",
  checkAuth,
  checkAdmin,
  [
    check("title", "Укажите заголовок").not().isEmpty(),
    check("description", "Укажите описание").not().isEmpty(),
  ],
  async (req, res) => {
    //validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //get data from req
    const { title, description } = req.body;
    const id = req.params.id;
    const url = req.files.url;
    //check video
    if (!url)
      return res.status(400).json({
        errors: [{ msg: "Добавьте материал для курса", variant: "danger" }],
      });
    try {
      //gen salt
      let date = new Date();
      let salt =
        date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
      //save video
      url.name = salt + url.name;
      url.mv("./client_app/public/videos/" + url.name);
      let lesson = {
        title,
        description,
        url: "./client_app/public/videos/" + url.name,
      };
      //find course by id
      let course = await Course.findById(id);
      //save course
      course.lessons.push(lesson);
      await course.save();
      return res.status(200).json({
        msg: `Урок: ${title} добавлен к курсу ${course.title}`,
        variant: "success",
      });
    } catch (err) {
      Sentry.captureException(err);
      res.status(500).json({ errors: [{ msg: "Ошибка сервера" }] });
    }
  }
);

/**
 * *Update course by id
 * @params title, description, img
 */
router.put("/:id", checkAuth, checkAdmin, async (req, res) => {
  const id = req.params.id;
  let course = await Course.findById(id);
  if (!course) return res.status(404).json({ msg: "Курс не найден" });
  try {
    const { title, description } = req.body;
    const updatedCourse = {};
    if (title) updatedCourse.title = title;
    if (description) updatedCourse.description = description;
    if (req.files) {
      const img = req.files.img;
      let date = new Date();
      let salt =
        date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
      img.name = salt + img.name;
      img.mv("./client_app/public/images/" + img.name);
      updatedCourse.img = "./client_app/public/images/" + img.name;
    }
    await Course.findOneAndUpdate({ _id: id }, updatedCourse, {
      new: true,
      upsert: true,
    });
    return res.status(200).json({ msg: "Материал курса был обновлён" });
  } catch (err) {
    Sentry.captureException(err);
    res.status(500).json({ errors: [{ msg: "Ошибка сервера" }] });
  }
});

module.exports = router;
