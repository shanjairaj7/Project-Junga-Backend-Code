const { validationResult } = require("express-validator");
const Comment = require("../models/comment");
const Task = require("../models/task");

exports.createTask = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }

  const newTask = new Task(req.body);
  newTask.createdBy = req.user.id;

  newTask.save((err, task) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to save task",
      });
    }

    return res.json({
      message: "Task created",
      task,
    });
  });
};

exports.getTask = (req, res) => {
  if (req.task) {
    return res.json({
      task: req.task,
    });
  }
};

exports.getAllTasks = (req, res) => {
  const user = req.user;

  Task.find({ createdBy: user.id })
    .populate({
      path: "comments",
      populate: {
        path: "createdBy",
        model: "User",
        select: "-password",
      },
    })
    .populate({
      path: "createdBy",
      model: "User",
      select: "-password",
    })
    .exec((err, tasks) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to find tasks",
        });
      }

      if (tasks) {
        return res.json({
          message: "Successfull found tasks",
          tasks,
        });
      } else {
        return res.json({
          message: "Tasks are empty",
          tasks,
        });
      }
    });
};

exports.updateTask = (req, res) => {
  const task = req.task;

  Task.findOneAndUpdate({ _id: task._id }, req.body, { new: true })
    .populate("createdBy")
    .exec((err, updatedTask) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to update task",
        });
      }

      updatedTask.createdBy.password = undefined;

      return res.json({
        message: "Successfully updated task",
        task: updatedTask,
      });
    });
};

exports.deleteUser = (req, res) => {
  const task = req.task;

  Task.findOneAndDelete({ _id: task._id })
    .populate("createdBy")
    .exec((err, deletedTask) => {
      if (err) {
        return res.status(400).json({
          error: `Not able to delete task ${task.title.substring(0, 10)}...`,
        });
      }

      deletedTask.createdBy.password = undefined;

      return res.json({
        message: "Successfull deleted Task",
        task: deletedTask,
      });
    });
};

exports.addComment = (req, res) => {
  const task = req.task;
  const user = req.user;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }

  const newComment = new Comment({ text: req.body.text, createdBy: user.id });
  newComment.save((err, comment) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to leave a comment",
      });
    }

    Task.findOneAndUpdate(
      { _id: task._id },
      { $push: { comments: comment._id } },
      { new: true }
    )
      .populate({
        path: "comments",
        populate: {
          path: "createdBy",
          model: "User",
          select: "-password",
        },
      })
      .populate("createdBy")
      .exec((err, task) => {
        if (err) {
          return res.status(400).json({
            error: "Not able to update task with the comment",
          });
        }

        return res.json({
          message: "Successfully added comment",
          task,
        });
      });
  });
};

exports.changeTaskStatus = (req, res) => {
  const task = req.task;

  const statuses = ["TODO", "IN PROGRESS", "COMPLETE"];

  const isStatusFound = statuses.find((status) => status === req.body.status);
  if (!isStatusFound) {
    return res.status(400).json({
      error: "Status is not valid",
    });
  }

  if (!req.body.status) {
    return res.status(400).json({
      error: "Status is required",
    });
  }

  Task.findOneAndUpdate(
    { _id: task._id },
    { $set: { status: req.body.status } },
    { new: true }
  )
    .populate({
      path: "comments",
      populate: {
        path: "createdBy",
        model: "User",
        select: "-password",
      },
    })
    .populate("createdBy")
    .exec((err, task) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to update status of task",
        });
      }

      return res.json({
        message: "Successfully changed status of task",
        task,
      });
    });
};
