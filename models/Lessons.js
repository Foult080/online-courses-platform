const mongoose = require("mongoose");
const LessonsShcema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  comments: [
    {
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      crdate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  crdate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Lessons = mongoose.model("lessons", LessonsShcema);
