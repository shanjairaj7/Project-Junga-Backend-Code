const Task = require("../models/task");

exports.getTaskById = (req, res, next) => {
  const taskId = req.params.taskId;

  Task.findOne({ _id: taskId })
    .populate("createdBy")
    .exec((err, task) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to find task",
        });
      }

      if (task) {
        req.task = task;
        req.task.createdBy.password = undefined;
        next();
      } else {
        res.status(404).json({
          error: "Not able to find task with the given ID",
        });
      }
    });
};
