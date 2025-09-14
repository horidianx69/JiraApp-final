const express = require("express");

const authMiddleware = require("../middleware/auth.js");
const {
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  createTask,
} = require("../controllers/taskController.js");

const taskRouter = express.Router();

taskRouter
  .route("/gp")
  .get(authMiddleware, getTasks)
  .post(authMiddleware, createTask);

// taskRouter.get("/gp", authMiddleware, getTasks); repetative
// taskRouter.post("/gp", authMiddleware, createTask); messier

taskRouter
  .route("/gp/:id")
  .get(authMiddleware, getTaskById)
  .put(authMiddleware, updateTask)
  .patch(authMiddleware, updateTask)  
  .delete(authMiddleware, deleteTask);


module.exports = taskRouter;
