import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Settings } from "lucide-react";

const Navbar = () => {
  const menuref = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const navigate = useNavigate(); // react-router-dom ka hook hai navigate karne mein help karta
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 font sans">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto">
        <div
          className="flex items-center gap-2 cursor pointer group "
          onClick={() => navigate("/")}
        >
          {/* LOGO */}
          <div className="relative w-10 h-10 flex items-center rounded-xl bg-gradient-to-br from-rose-500 via-red-500 to-pink-500 shadow-lg group-hover:shadow-rose-300/50 group-hover:scale-150 transition-all duration-300 px-1">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          {/* Brand Name */}
          <span className="text-2xl font-bold bg-gradient-to-br from-rose-500 via-red-500 to-pink-500 bg-clip-text text-transparent tracking-wide">
            WorkWise
          </span>
        </div>
        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button
            className="hover:text-rose-500"
            onClick={() => navigate("/profile")}
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Dropdown */}
          <div ref={menuref} className="relative">
            <button
              onClick={handleMenuToggle}
              className=" flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-rose-500 transition-colors duration-300 border border-transparent hover:border-rose-300"
            >
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-red-500 to-pink-500 text-white font-semibold shadow-md">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className=" absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
