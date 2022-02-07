const { validationResult } = require('express-validator');

/**
 * Validate req data
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ status: 'error', errors: errors.array() });
  else next();
};

module.exports = { validate };
