const mongoose = require("mongoose");
const Requests = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  request: {
    type: String,
    required: true,
  },
  contacts: {
    type: String,
    default: null,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  crdate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Requests = mongoose.model("requests", Requests);
