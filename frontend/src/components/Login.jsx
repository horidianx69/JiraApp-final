import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { BUTTONCLASSES, INPUTWRAPPER, feilds } from "../assets/constant";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const INITIAL_FORM = { email: "", password: "" };

const Login = ({ onSubmit, onSwitchMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const url = "http://localhost:3000";

  // 🔹 Restore session if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token) {
      (async () => {
        try {
          const { data } = await axios.get(`${url}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.success) {
            onSubmit?.({ token, userId, ...data.user });
            toast.success("Session restored");
            navigate("/");
          } else {
            localStorage.clear();
          }
        } catch (error) {
          console.error("❌ Session restore error:", error);
          localStorage.clear();
        }
      })();
    }
  }, [navigate, onSubmit]);

  // 🔹 Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${url}/api/user/login`, formData);
      const data = res.data;

      if (!data.token) throw new Error(data.message || "Login failed (no token)");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

      setFormData(INITIAL_FORM);
      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user });

      toast.success("Login successful!");
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      console.error("❌ Login error:", error);
      if (error.response) {
        toast.error(error.response.data?.message || "Invalid credentials");
      } else {
        toast.error("Server error or no response from backend");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    toast.dismiss();
    onSwitchMode?.();
    navigate("/signup");
  };

  return (
    <div className="max-w-md bg-white w-full shadow-lg border border-purple-100 rounded-xl p-8">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full mx-auto flex items-center justify-center mb-4">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome Laadle</h2>
        <p className="text-gray-500 text-sm mt-1">
          Sign in to continue to WorkWise
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {feilds.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
          <div key={name} className={INPUTWRAPPER}>
            <Icon className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type={isPassword ? (showPassword ? "text" : "password") : type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) =>
                setFormData({ ...formData, [name]: e.target.value })
              }
              className="w-full focus:outline-none text-sm text-gray-700"
              required
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 text-gray-500 hover:text-rose-500 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        ))}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe((prev) => !prev)}
            className="h-4 w-4 text-rose-500 focus:ring-red-600 border-gray-300 rounded"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
            Remember Me
          </label>
        </div>

        <button type="submit" className={BUTTONCLASSES} disabled={loading}>
          {loading ? (
            "Logging in..."
          ) : (
            <>
              <LogIn className="w-5 h-5" /> Login
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          className="text-rose-500 hover:underline font-medium transition-colors"
          onClick={handleSwitchMode}
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;


