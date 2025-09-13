import React, { useEffect } from "react";
import {
  getPriorityBadgeColor,
  MENU_OPTIONS,
  TI_CLASSES,
} from "../assets/constant";
import { useState } from "react";
import axios from "axios";
import { CheckCircle2, MoreVertical } from "lucide-react";

const API_BASE = "http://localhost:3000/api/tasks";

const TaskItem = ({
  task,
  onRefresh,
  onLogout,
  showCompletedCheckbox = true,
}) => {
  const borderColor =
    task.priority === "high"
      ? "border-red-500"
      : task.priority === "medium"
      ? "border-yellow-500"
      : "border-green-500";

  const [showMenu, setShowMenu] = useState(false);
  const [isCompleted, setIsCompleted] = useState(
    [true, 1, "yes"].includes(
      typeof task.completed === "string"
        ? task.completed.toLowerCase()
        : task.completed
    )
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);

  useEffect(() => {
    setIsCompleted(
      [true, 1, "yes"].includes(
        typeof task.completed === "string"
          ? task.completed.toLowerCase()
          : task.completed
      )
    );
  }, [task.completed]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const handleComplete = async () => {
    const newStatus = isCompleted ? "No" : "Yes";
    try {
      const response = await axios.patch(
        `${API_BASE}/${task.id}/gp`,
        {
          completed: newStatus,
        },
        {
          headers: getAuthHeaders(),
        }
      );
      setIsCompleted(!isCompleted);
      onRefresh?.();
    } catch (error) {
      console.error("Error updating task status:", error);
      if (error.response && error.response.status === 401) {
        onLogout?.();
      }
    }
  };

  const progress = subtasks.length
    ? (subtasks.filter((subtask) => subtask.completed).length /
        subtasks.length) *
      100
    : 0;

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/gp/${task._id || task.id}`, {
        headers: getAuthHeaders(),
      }); 

      onRefresh?.();
    } catch (error) {
      console.error("Error deleting task:", error);
      if (error.response && error.response.status === 401) {
        onLogout?.();
      }
    }
  };

  const handleAction = (action) => {
    setShowMenu(false);
    switch (action) {
      case "edit":
        setShowEditModal(true);
        break;
      case "delete":
        handleDelete();
        break;
      default:
        break;
    }
  };

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
                className={`${TI_CLASSES.checkboxIconBase} ${
                  isCompleted ? "fill-green-500" : ""
                }`}
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
                task.priority
              )}`}
            >
              {task.priority}
            </span>
            {task.description && (
              <p className={`${TI_CLASSES.description}`}>{task.description}</p>
            )}
          </div>
        </div>
        <div className={TI_CLASSES.rightContainer}>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={TI_CLASSES.menuButton}
            >
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" size={18} />
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
        </div>
      </div>
    </>
  );
};

export default TaskItem;
