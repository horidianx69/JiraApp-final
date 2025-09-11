import React, { useCallback, useMemo, useState } from "react";
import {
  ADD_BUTTON,
  HEADER,
  ICON_WRAPPER,
  STAT_CARD,
  STATS,
  STATS_GRID,
  WRAPPER,
  VALUE_CLASS,
  LABEL_CLASS,
  FILTER_WRAPPER,
  FILTER_LABELS,
  SELECT_CLASSES,
  FILTER_OPTIONS,
  TABS_WRAPPER,
  TAB_BASE,
  EMPTY_STATE,
} from "../assets/constant";
import { Calendar1Icon, Filter, HomeIcon, Plus, PlusIcon } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TaskItem from "./TaskItem";
import TaskModel from "./TaskModel"; 


const API_BASE = "http://localhost:3000/api/tasks";

const Dashboard = () => {
  const { tasks, refreshTasks } = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("all");

  const stats = useMemo(
    () => ({
      total: tasks.length,
      lowPriority: tasks.filter(
        (task) => task.priority?.toLowerCase() === "low"
      ).length,
      mediumPriority: tasks.filter(
        (task) => task.priority?.toLowerCase() === "medium"
      ).length,
      highPriority: tasks.filter(
        (task) => task.priority?.toLowerCase() === "high"
      ).length,
      completed: tasks.filter(
        (task) =>
          task.completed === true ||
          task.completed === 1 ||
          (typeof task.completed === "string" &&
            task.completed.toLowerCase() === "true")
      ).length,
    }),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      switch (filter) {
        case "today":
          return dueDate.toDateString() === today.toDateString();
        case "week":
          return dueDate >= today && dueDate <= nextWeek;
        case "high":
        case "medium":
        case "low":
          return task.priority?.toLowerCase() === filter;
        default:
          return true;
      }
    });
  }, [tasks, filter]);

  const handleTaskSave = useCallback(
    async (taskData) => {
      try {
        if (taskData.id) await fetch(`${API_BASE}/${taskData.id}/gp`, taskData);
        refreshTasks();
        setShowModal(false);
        setSelectedTask(null);
      } catch (error) {
        console.error("Error saving task:", error);
      }
    },
    [refreshTasks]
  );

  return (
    <div className={WRAPPER}>
      {/* HEADER */}
      <div className={HEADER}>
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <HomeIcon className="text-rose-500 w-5 h-5 md:w-6 md:h-6 shrink-0" />
            <span className="truncate font-bold">Tasks Overview</span>
          </h1>
          <p className="text-sm mt-1 ml-7 text-gray-600 truncate">
            Welcome to your dashboard
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className={ADD_BUTTON}>
          <Plus /> Create Task
        </button>
      </div>

      {/* Stats */}
      <div className={STATS_GRID}>
        {STATS.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <div key={stat.key} className={`${STAT_CARD} ${stat.borderColor}`}>
              <div className="flex items-center gap-2 md:gap-3">
                <div className={`${ICON_WRAPPER} ${stat.iconColor}`}>
                  <StatIcon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`${VALUE_CLASS} ${
                      stat.gradient
                        ? "bg-gradient-to-r from-rose-500 to-red-500"
                        : stat.textColor
                    }`}
                  >
                    {stats[stat.value]}
                  </p>
                  <p className={LABEL_CLASS}>{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Contents */}
      <div className="space-y-6">
        <div className={FILTER_WRAPPER}>
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="w-4 h-4 text-rose-600 shrink-0" />
            <h2 className="text-base md:text-lg font-semibold text-gray-800 truncate">
              {FILTER_LABELS[filter]}
            </h2>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={SELECT_CLASSES}
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>

          <div className={TABS_WRAPPER}>
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`${TAB_BASE} ${
                  filter === option
                    ? "bg-rose-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {/* Task list */}

        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className={EMPTY_STATE.wrapper}>
              <div className={EMPTY_STATE.iconWrapper}>
                <Calendar1Icon className=" w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No tasks found
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {filter === "all" ? "Create your first task" : "No tasks found"}
              </p>

              <button
                onClick={() => setShowModal(true)}
                className={EMPTY_STATE.btn}
              >
                Add New Task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task._id || task.id}
                task={task}
                onRefresh={refreshTasks}
                showCompleteCheckbox
                onEdit={() => {
                  setSelectedTask(task);
                  setShowModal(true);
                }}
              />
            ))
          )}
        </div>
        {/* Add task items */}
        <div onClick={() => setShowModal(true)} className="hidden md:flex items-center justify-center p-4 border-2 border-dashed border-rose-200 rounded-xl hover:border-rose-400 bg-rose-50/50 cursor-pointer transition-colors">
          <PlusIcon className="w-5 h-5 text-rose-500 mr-2"></PlusIcon>
          <span className="font-medium text-rose-500">Add Task</span>
        </div>

        {/* Modal */}
        <TaskModel isOpen={showModal || !selectedTask}
          onClose={() => {
            setShowModal(false);
            setSelectedTask(null);
          }}
          taskToEdit={selectedTask} onSave={handleTaskSave}
        />
      </div>
    </div>
  );
};

export default Dashboard;
