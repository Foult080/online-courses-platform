const mongoose = require('mongoose');
const LessonsShcema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      default: 'mp4',
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('lessons', LessonsShcema);
