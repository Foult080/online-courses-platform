const router = require('express').Router();

// api routes
router.get('/health', async (req, res) => {
  res.status(200).json({ status: 'success', msg: 'Сервер работает исправно' });
});
router.use('/api/users', require('./users'));
router.use('/api/auth', require('./auth'));
router.use('/api/courses', require('./courses'));
router.use('/api/video', require('./video'));

module.exports = router;
