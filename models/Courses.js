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
      type: mongoose.Schema.Types.ObjectId,
      ref: "lessons",
    },
  ],
  crdate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Courses = mongoose.model("courses", CoursesShcema);