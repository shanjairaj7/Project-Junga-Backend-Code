const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  createTask,
  getTask,
  updateTask,
  deleteUser,
  addComment,
  changeTaskStatus,
  getAllTasks,
} = require("../controllers/task");
const { isAuthorised } = require("../middlewares/user");
const { getTaskById } = require("../middlewares/task");

// Params
router.param("taskId", getTaskById);

// POST
router.post(
  "/task/create",
  [check("title", "Title is required to create a Task").isLength({ min: 1 })],
  isAuthorised,
  createTask
);

// GET
router.get("/task/:taskId", isAuthorised, getTask);
router.get("/tasks", isAuthorised, getAllTasks);

// PUT
router.put("/task/:taskId", isAuthorised, updateTask);
router.put(
  "/task/:taskId/comment",
  [check("text", "Comment text is required").isLength({ min: 1 })],
  isAuthorised,
  addComment
);
router.put("/task/:taskId/change-status", isAuthorised, changeTaskStatus);

// DELETE
router.delete("/task/:taskId", isAuthorised, deleteUser);

module.exports = router;
