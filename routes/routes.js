const router = require('express').Router();

// api routes
router.get('/health', async (req, res) => {
  res.status(200).json({ status: 'success', msg: 'Сервер работает исправно' });
});
router.use('/api/users', require('./users'));
router.use('/api/auth', require('./auth'));
router.use('/api/materials', require('./materials'));

//checking uploading to host
const { checkAuth } = require('../middleware/auth');
const Lesson = require('../models/Lessons');
router.post('/api/add-lesson', checkAuth, async (req, res) => {
  //get data from req
  const { title, description } = req.body;
  const file = req.files.material || null;
  //check video
  if (!file) return res.status(400).json({ status: 'error', errors: [{ msg: 'Добавьте материал для курса', variant: 'danger' }] });
  try {
    //create lesson obj
    let lesson = new Lesson({ title, description });
    const format = file.name.split('.')[1];
    file.mv('./materials/' + lesson._id + '.' + format);
    lesson.format = format;
    await lesson.save();
    return res.status(200).json({
      status: 'success',
      msg: `Урок: ${title} добавлен`,
      data: lesson,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: 'Ошибка сервера' }] });
  }
});

module.exports = router;
