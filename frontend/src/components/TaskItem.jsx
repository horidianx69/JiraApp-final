import React, { useEffect, useState } from "react";
import { getPriorityBadgeColor, MENU_OPTIONS, TI_CLASSES } from "../assets/constant";
import axios from "axios";
import { isToday, format } from "date-fns";
import { CheckCircle2, MoreVertical, Calendar, Clock } from "lucide-react";
import TaskModel from "./TaskModel";

const API_BASE = "http://localhost:3000/api/tasks";

const TaskItem = ({ task, onRefresh, onLogout, showCompletedCheckbox = true }) => {
  const borderColor =
    task.priority === "high"
      ? "border-red-500"
      : task.priority === "medium"
      ? "border-yellow-500"
      : "border-green-500";

  const [showMenu, setShowMenu] = useState(false);
  const [isCompleted, setIsCompleted] = useState(!!task.completed);
  const [showEditModal, setShowEditModal] = useState(false);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);

  // Update completed state if task changes
  useEffect(() => {
    setIsCompleted(!!task.completed);
  }, [task.completed]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    return { Authorization: `Bearer ${token}` };
  };

  const handleComplete = async () => {
    const newStatus = !isCompleted;
    try {
      await axios.patch(
        `${API_BASE}/${task.id || task._id}`,
        { completed: newStatus },
        { headers: getAuthHeaders() }
      );
      setIsCompleted(newStatus);
      onRefresh?.();
    } catch (error) {
      console.error("Error updating task status:", error);
      if (error.response?.status === 401) onLogout?.();
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/gp/${task.id || task._id}`, {
        headers: getAuthHeaders(),
      });
      onRefresh?.();
    } catch (error) {
      console.error("Error deleting task:", error);
      if (error.response?.status === 401) onLogout?.();
    }
  };

  const handleAction = (action) => {
    setShowMenu(false);
    if (action === "edit") setShowEditModal(true);
    if (action === "delete") handleDelete();
  };

  const handleSave = async (updatedTask) => {
    try {
      const payload = {
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority.toLowerCase(),
        dueDate: updatedTask.dueDate,
        completed: updatedTask.completed,
      };

      await axios.put(`${API_BASE}/gp/${task.id || task._id}`, payload, {
        headers: getAuthHeaders(),
      });

      setShowEditModal(false);
      onRefresh?.();
    } catch (err) {
      if (err.response?.status === 401) onLogout?.();
    }
  };

  const progress = subtasks.length
    ? (subtasks.filter((subtask) => subtask.completed).length / subtasks.length) * 100
    : 0;

  return (
    <>
      <div className={`${TI_CLASSES.wrapper} ${borderColor}`}>
        <div className={TI_CLASSES.leftContainer}>
          {showCompletedCheckbox && (
            <button
              onClick={handleComplete}
              className={`${TI_CLASSES.completeBtn} ${
                isCompleted ? "text-green-500" : "text-gray-300"
              }`}
            >
              <CheckCircle2
                size={18}
                className={`${TI_CLASSES.checkboxIconBase} ${isCompleted ? "fill-green-500" : ""}`}
              />
            </button>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
            <h3
              className={`${TI_CLASSES.titleBase} ${
                isCompleted ? "text-gray-400 line-through" : "text-gray-800"
              }`}
            >
              {task.title}
            </h3>

            <span
              className={`${TI_CLASSES.priorityBadge} ${getPriorityBadgeColor(
                task.priority?.toLowerCase()
              )}`}
            >
              {task.priority?.toLowerCase()}
            </span>

            {task.description && (
              <p className={`${TI_CLASSES.description}`}>{task.description}</p>
            )}
          </div>
        </div>

        <div className={TI_CLASSES.rightContainer}>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className={TI_CLASSES.menuButton}>
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {showMenu && (
              <div className={TI_CLASSES.menuDropdown}>
                {MENU_OPTIONS.map((opt) => (
                  <button
                    key={opt.action}
                    onClick={() => handleAction(opt.action)}
                    className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-purple-50 flex items-center gap-2 transition-colors duration-200"
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            className={`${TI_CLASSES.dateRow} ${
              task.dueDate && isToday(new Date(task.dueDate))
                ? "text-fuchsia-600"
                : "text-gray-500"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {task.dueDate
              ? isToday(new Date(task.dueDate))
                ? "Today · " + format(new Date(task.dueDate), "MMM dd")
                : format(new Date(task.dueDate), "MMM dd")
              : ""}
          </div>

          <div className={TI_CLASSES.createdRow}>
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {task.createdAt ? format(new Date(task.createdAt), "hh:mm a") : ""}
          </div>
        </div>
      </div>

      <TaskModel
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        taskToEdit={task}
        onSave={handleSave}
      />
    </>
  );
};

export default TaskItem;

