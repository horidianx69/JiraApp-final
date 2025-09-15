import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import {
  Inputwrapper,
  MESSAGE_SUCCESS,
  MESSAGE_ERROR,
  FIELDS,
  BUTTONCLASSES,
} from "../assets/constant";
import LiquidEther from "./ui/LiquidEther";


const API_URL = "http://localhost:3000";
const INITIAL_FORM = { name: "", email: "", password: "" };

const SignUp = ({ onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await axios.post(
        `${API_URL}/api/user/register`,
        formData
      );
      console.log("SignUp successful", data);
      setMessage({
        text: "Registration successful! You can log in now.",
        type: "success",
      });
      setFormData(INITIAL_FORM);
    } catch (error) {
      console.error("Signup error:", error);
      setMessage({
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="max-w-md w-full bg-white shadow-lg border border-purple-100 rounded-xl p-8">

        
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm mt-1">
            Join WorkWise to manage your tasks
          </p>
        </div>

        {message.text && (
          <div
            className={
              message.type === "success" ? MESSAGE_SUCCESS : MESSAGE_ERROR
            }
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {FIELDS.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
            <div key={name} className={Inputwrapper}>
              <Icon className="text-purple-500 w-5 h-5 mr-2" />
              <input
                type={isPassword ? (showPassword ? "text" : "password") : type}
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
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  className="ml-2 text-gray-400 hover:text-red-400 transition-colors"
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

          <button type="submit" className={BUTTONCLASSES} disabled={loading}>
            {loading ? (
              "Signing Up..."
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Sign Up
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <button
            onClick={onSwitchMode}
            className="text-rose-600 hover:text-rose-700 hover:underline font-medium transition-colors"
          >
            Login
          </button>
        </p>
      </div>

  );
};

export default SignUp;
