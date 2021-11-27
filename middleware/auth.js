require("dotenv").config();
const jwt = require("jsonwebtoken");
const Sentry = require("@sentry/node");

/**
 * * Check users credential in request
 */
const auth = async (req, res, next) => {
  //get token from header
  const token = req.header("authToken");
  //check token
  if (!token) {
    return res.status(401).json({ msg: "Нет токена, авторизация отклонена " });
  }
  //verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    Sentry.captureException(error);
    res.status(401).json({ msg: "Токен не верен" });
  }
};

module.exports = auth;
