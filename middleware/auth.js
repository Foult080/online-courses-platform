require("dotenv").config();
const jwt = require("jsonwebtoken");
const Sentry = require("@sentry/node");

/**
 * * Check users credential in request
 */
const checkAuth = async (req, res, next) => {
  //get token from header
  const token = req.header("authToken");
  //check token
  if (!token) {
    return res.status(401).json({ msg: "Нет токена, авторизация отклонена" });
  }
  //verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    Sentry.captureException(err);
    res.status(401).json({ msg: "Токен не верен" });
  }
};


/**
 * *Check user role
 */
const checkAdmin = async (req, res, next) => {
  try {
    //get user role
    const role = req.user.role;
    //check role
    if (role == "admin") next();
    else
      return res.status(401).json({ msg: "У вас нет прав на создание курса" });
  } catch (err) {
    Sentry.captureException(err);
    res.status(401).json({ msg: "Токен не верен" });
  }
};

module.exports = { checkAuth, checkAdmin };
