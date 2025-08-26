import React, { useCallback, useEffect } from "react";
import Navbar from "./navbar";
import Sidebar from "./Sidebar";
import { useState ,useMemo} from "react";
import axios from "axios";

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
      // check axios error response for 401
      if (err.response?.status === 401) {
        onLogout?.();
      }
    } finally {
      setLoading(false);
    }
  }, [onLogout]); // include any external deps used inside the callback

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats= useMemo(() =>{
    const completedTasks= tasks.filter(t =>
      t.completed===true||
      t.completed ===1||
      (typeof t.completed ==="string" && t.completed.toLowerCase()==='yes')
    ).length
    const totalCount=tasks.length;
    const pendingCount= totalCount-completedTasks;
    const completionPercentage=totalCount?Math.round((completedTasks/totalCount)*100):0;

    return{
      totalCount,
      completedTasks,
      pendingCount,
      completionPercentage
    }
  }, [tasks]);

  //Statistics card right mein
  const StatCard = ({title,value,icon})=>{
    <div className="p-2 sm:p-3 rounded-xl bg-white shadow-sm border border-rose-500 hover:shadow-md transition-all duration:300 hover:border-rose-500 group">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-rose-500/10 to-pink-500/10 group-hover:from-rose-500/20 group-hover:to-pink-500/20">{icon}</div>
        <div className="min-w-0">
          <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            {value}
          </p>
          <p className="text-xs text-gray-500 font-medium">{title}</p>
        </div>
      </div>
    </div>
  }

  //Loading
  if(loading) return(
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"/>
    </div>
  )

  if(error) return(
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 max-w-md">
        <p className="font-medium mb-2">Error Looading Tasks</p>
        <p className="text-sm">{error}</p>
        <button onClick={fetchTasks} className="mt-4 py-2 px-4 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">Try Again</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks}></Sidebar>

      <div className="ml-0 xl:ml-64 lg:ml-64 md:ml-16 pt-16 p-3 sm:p-4 md:p-4 transition-all duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 space-y-3 sm:space-y-4">
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
