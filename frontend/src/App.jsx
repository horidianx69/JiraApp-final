import React, { useEffect, useState } from "react";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import PendingPage from "./pages/PendingPage";
import CompletedPage from "./pages/CompletedPage";
import Profile from "./components/Profile";


function App() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  // Keep currentUser in sync with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // Handles signup/login success
  const handleSubmitAuth = (data) => {
    const user = {
      userId: data.userId, // ✅ Save userId
      token: data.token, // ✅ Save token
      email: data.email,
      name: data.name || "User",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        data.name || "User"
      )}&background=random`,
    };
    setCurrentUser(user);
    navigate("/", { replace: true });
  };

  // Handles logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  // Wrapper for protected routes
  const ProtectedLayout = () => {
    return (
      <Layout user={currentUser} onLogout={handleLogout}>
        <Outlet/>
      </Layout>
    );
  };

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Login
              onSubmit={handleSubmitAuth}
              onSwitchMode={() => navigate("/signup")}
            />
          </div>
        }
      />

      {/* Sign Up */}
      <Route
        path="/signup"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <SignUp
              onSubmit={handleSubmitAuth}
              onSwitchMode={() => navigate("/login")}
            />
          </div>
        }
      />

      {/* Protected routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pending" element={<PendingPage />} />
        <Route path="/complete" element={<CompletedPage />} />
        <Route path="/profile" element={<Profile user={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />} />
      </Route>
    </Routes>
  );
}

export default App;
