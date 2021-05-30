const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: 1,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["TODO", "IN PROGRESS", "COMPLETE"],
      default: "TODO",
    },
    comments: {
      type: [ObjectId],
      ref: "Comment",
    },
    createdBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
