
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    likes: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      default: "General"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);

