const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      // required: true,
    },
    content: {
      type: String,
      // required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    author: { 
      type: String,
    //   required: true,
    },
    publicId: {
      type: String,
  },
    imageUrl: {
      type: String,
      required: false,
    },
    tags: [String],
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("newpost", postSchema);
