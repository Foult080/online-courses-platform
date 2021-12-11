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
    }
  ],
  crdate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Courses = mongoose.model("courses", CoursesShcema);
