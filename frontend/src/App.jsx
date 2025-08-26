import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const handleSubmitAuth = (data) => {
    const user = {
      email: data.email,
      name: data.name || "User",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        data.name || "User"
      )}&background=random`,
    };
    setCurrentUser(user);
    navigate("/", { replace: true });
  };
  const ProtectedLayout = () => {
    <Layout user={currentUser} onLogout={handleLogout}>
      {" "}
      <Outlet></Outlet>
    </Layout>;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/", { replace: true });
  };

  return (
    <Routes>
      <Route path='/login' element={<div className="fixed insert-0 bg-black bg-opacity-50 flex items-center justify-center"><Login onSubmit={handleSubmitAuth} onSwitchMode={()=>navigate('/signup')}></Login></div>}></Route>

      <Route path='/signup' element={<div className="fixed insert-0 bg-black bg-opacity-50 flex items-center justify-center"><SignUp onSubmit={handleSubmitAuth} onSwitchMode={()=>navigate('/login')}></SignUp></div>}></Route>
      
      <Route path="/" element={<Layout/>}></Route>
    </Routes>
  );
}

export default App;
