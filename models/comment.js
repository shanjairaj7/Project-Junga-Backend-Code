const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      minlength: 1,
      required: true,
    },
    createdBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
