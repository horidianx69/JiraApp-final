const Task = require("../models/taskModel");

exports.createTask = async (req, res) => {
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

exports.getTasks = async (req, res) => {
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
exports.getTaskById = async (req, res) => {
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

exports.updateTask = async (req, res) => {
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

//Delete A Task

exports.deleteTask= async(req,res)=>{
  try {
    const deleted= await Task.findOneAndDelete({_id:req.params.id,owner:req.user.id})

    if(!deleted){
      return res.status(404).json({success:false,message:'Not deleted,Task not found or not yours'})
    }
    res.json({success:true,message:'Task deleted'})

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });     
  }
}
