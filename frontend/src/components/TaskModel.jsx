import React, { useCallback, useEffect, useState } from "react";
import {
  baseControlClasses,
  DEFAULT_TASK,
  priorityStyles,
} from "../assets/constant";
import { AlignLeft, Calendar, CheckCircle, Flag, PlusCircle, Save, X } from "lucide-react";

const API_BASE = "http://localhost:3000/api/tasks";

const TaskModel = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
  const [taskData, setTaskData] = useState(DEFAULT_TASK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isOpen) return;
    if (taskToEdit) {
      const normalized =
        taskToEdit.completed === "true" ||
        taskToEdit.completed === 1 ||
        (typeof taskToEdit.completed === "string" &&
          taskToEdit.completed.toLowerCase() === "true")
          ? "Yes"
          : "No";

      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        priority: taskToEdit.priority || "Low",
        dueDate: taskToEdit.dueDate?.split("T")[0] || "",
        completed: normalized,
        id: taskToEdit.id || null,
      });
    } else {
      setTaskData(DEFAULT_TASK);
    }
    setError(null);
  }, [isOpen, taskToEdit]); // ✅ deps

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (taskData.dueDate < today) {
        setError("Due date cannot be in the past");
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const isEdit = Boolean(taskData.id);
        const url = isEdit ? `${API_BASE}/${taskData.id}` : `${API_BASE}/gp`;
        const response = await fetch(url, {
          method: isEdit ? "PUT" : "POST",
          headers: getHeaders(),
          body: JSON.stringify(taskData),
        });
        if (!response.ok) {
          if (response.status === 401) {
            onLogout();
            throw new Error("Session expired. Please login again.");
          }
          const errData = await response.json();
          throw new Error(errData.message || "Failed to Save Task");
        }
        const save = await response.json();
        onSave?.(save);
        onClose();
      } catch (error) {
        console.log("Error submitting form:", error);
        setError(error.message || "Failed to Save Task");
      } finally {
        setLoading(false);
      }
    },
    [taskData, today, getHeaders, onSave, onClose, onLogout]
  );

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-rose-200 rounded-xl max-w-md w-full shadow-lg relative p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {taskData.id ? (
              <Save className="text-rose-500 w-5 h-5" />
            ) : (
              <PlusCircle className="text-rose-500 w-5 h-5" />
            )}{" "}
            {taskData.id ? "Edit Task" : "Create Task"}{" "}
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-gray-500 hover:text-rose-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center border border-rose-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-rose-500 transition-all duration-200">
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                required
                placeholder="Task title"
                className="w-full border-none outline-none focus:ring-0 text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <AlignLeft className="w-4 h-4 mr-2 text-rose-500" /> Description
            </label>

            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              required
              placeholder="Add details about your Task"
              rows="3"
              className={baseControlClasses}
            />
          </div>

          <div className="grid grid-col-2 gap-4">
            <div>
              <label className=" flex item-center gap-1 text-sm font-medium text-gray-700 mb-1">
                <Flag className="w-4 h-4 mr-2 text-rose-500" /> Priority
              </label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className={`${baseControlClasses} ${
                  priorityStyles[taskData.priority]
                }`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className=" flex item-center gap-1 text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 mr-2 text-rose-500" /> Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleChange}
                min={today}
                required
                className={baseControlClasses}
              />
            </div>
          </div>
          
          <div>
              <label className=" flex item-center gap-1 text-sm font-medium text-gray-700 mb-2">
                <CheckCircle className="w-4 h-4 mr-2 text-rose-500" /> Status
              </label>
              <div className="flex gap-4"></div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TaskModel;
