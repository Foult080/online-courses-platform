const mongoose = require("mongoose");
const CoursesShcema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  lessons: [
    {
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
    },
  ],
  crdate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Courses = mongoose.model("courses", CoursesShcema);
