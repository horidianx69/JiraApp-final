import React, { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "./navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { Circle, TrendingUp, Clock } from "lucide-react";

const Layout = ({ onLogout, user }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No auth token found");
        onLogout?.(); // log user out or redirect to login
        return;
      }

      const res = await axios.get("http://localhost:3000/api/tasks/gp", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.tasks)
        ? data.tasks
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setTasks(arr);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load Tasks");

      if (err.response?.status === 401) {
        onLogout?.();
      }
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(
      (t) =>
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === "string" && t.completed.toLowerCase() === "yes")
    ).length;

    const totalCount = tasks.length;
    const pendingCount = totalCount - completedTasks;
    const completionPercentage = totalCount
      ? Math.round((completedTasks / totalCount) * 100)
      : 0;

    return {
      totalCount,
      completedTasks,
      pendingCount,
      completionPercentage,
    };
  }, [tasks]);

  const StatCard = ({ title, value, icon }) => (
    <div className="p-2 sm:p-3 rounded-xl bg-white shadow-sm border border-rose-500 hover:shadow-md transition-all duration-300 hover:border-rose-500 group">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-rose-500/10 to-pink-500/10 group-hover:from-rose-500/20 group-hover:to-pink-500/20">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            {value}
          </p>
          <p className="text-xs text-gray-500 font-medium">{title}</p>
        </div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 max-w-md">
          <p className="font-medium mb-2">Error Loading Tasks</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchTasks}
            className="mt-4 py-2 px-4 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks} />

      <div className="ml-0 xl:ml-64 lg:ml-64 md:ml-16 pt-16 p-3 sm:p-4 md:p-4 transition-all duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 space-y-3 sm:space-y-4">
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>

          {/* Right Sidebar: Stats + Recent */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-rose-100">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
                Stats Overview
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <StatCard
                  title="Total Tasks"
                  value={stats.totalCount}
                  icon={<Circle className="w-4 h-4 text-rose-500" />}
                />
                <StatCard
                  title="Completed"
                  value={stats.completedTasks}
                  icon={<Circle className="w-4 h-4 text-green-500" />}
                />
                <StatCard
                  title="Pending"
                  value={stats.pendingCount}
                  icon={<Circle className="w-4 h-4 text-blue-500" />}
                />
                <StatCard
                  title="Completion Rate"
                  value={`${stats.completionPercentage}%`}
                  icon={<Circle className="w-4 h-4 text-rose-500" />}
                />
              </div>

              <hr className="my-3 sm:my-4 border-purple-100" />

              {/* Progress Bar */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-gray-700">
                  <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                    <Circle className="w-3 h-3 text-red-400 fill-red-500" />
                    Progress
                  </span>
                  <span className="text-xs bg-purple-100 text-rose-700 px-2 rounded-full">
                    {stats.completedTasks}/{stats.totalCount}
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="flex gap-1.5 items-center">
                    <div className="flex-1 h-2 sm:h-3 bg-purple-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-400 to-red-500 transition-all duration-500"
                        style={{ width: `${stats.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-purple-100">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                Recent Activities
              </h3>

              <div className="space-y-2 sm:space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task._id || task.id}
                    className="flex items-center justify-between p-2 sm:p-3 hover:bg-red-50/50 rounded-lg transition-colors duration-200 border border-transparent hover:border-red-100"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 break-words whitespace-normal">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {task.createdAt
                          ? new Date(task.createdAt).toLocaleDateString()
                          : "No data"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full shrink-0 ml-2 ${
                        task.completed
                          ? "bg-green-100 text-green-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {task.completed ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="text-center py-6 px-2">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                      <Clock className="w-8 h-8 text-purple-500" />
                    </div>
                    <p className="text-sm text-gray-500">No recent Activity</p>
                    <p className="text-sm text-gray-500">
                      Tasks will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;


