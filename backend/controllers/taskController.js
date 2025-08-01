const Task = require("../models/taskModel");

const createTask = async (req, res) => {
  try {
    const { title, desc, priority, dueDate, completed } = req.body;

    const task = new Task({
      title,
      desc,
      priority,
      dueDate,
      completed: completed === "Yes" || completed === true,
      owner: req.user.id,
    });
    const saved = await task.save();
    res.status(201).json({ success: true, message: "Save hogaya" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get All Task for Logged In User-

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({
      createdAt: -1,
    }); //Sorts the tasks by creation date, with -1 meaning newest first (descending order).
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get single task by ID-
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Update a Task-

const updateTask = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.completed !== undefined) {
      data.completed = data.completed === "Yes" || data.completed === true;
    }
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      data,
      { new: true, runValidators: true }
    );
    if (!updated){
      return res
        .status(404)
        .json({ success: false, message: "Task not found or not yours" });
    }
    res.json({task:updated})
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
