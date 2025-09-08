import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  BACK_BUTTON,
  FULL_BUTTON,
  INPUT_WRAPPER,
  personalFields,
  SECTION_WRAPPER,
} from "../assets/constant";
import { ChevronLeft, Save, UserCircle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = ({ user, setCurrentUser, onLogout }) => {
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000";
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(`${API_URL}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data;
        if (data.success) {
          setProfile({
            name: data.user.name || "",
            email: data.user.email || "",
          });
        } else {
          toast.error(data.message || "Failed to fetch user data");
        }
      })
      .catch((error) => {
        toast.error("Error fetching user data: " + error.message);
      });
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_URL}/api/user/profile`,
        { name: profile.name, email: profile.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success("Profile updated successfully");
        setCurrentUser((prev) => ({
          ...prev,
          name: profile.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.name
          )}&background=random`,
        }));
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
    }
  }; // ✅ missing closing brace added

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className={BACK_BUTTON}>
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to dashboard
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {profile.name
              ? profile.name[0].toUpperCase()
              : user.name[0].toUpperCase()}
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800">
              Account Settings
            </h3>
            <p className="text-gray-600 text-sm">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
        <div>
          <div className="grid md:grid-cols-2 gap-8">
            <section className={SECTION_WRAPPER}>
              <div className="flex items-center gap-2 mb-6">
                <UserCircle className="w-5 h-5 text-rose-600" />
                <h2 className="text-xl font-semi-bold text-gray-800">
                  Personal Information
                </h2>
              </div>

              <form onSubmit={saveProfile} className="space-y-4">
                {personalFields.map(
                  ({ name, type, placeholder, icon: Icon, isPassword }) => (
                    <div key={name} className={INPUT_WRAPPER}>
                      <Icon className="text-purple-500 w-5 h-5 mr-2" />
                      <input
                        type={
                          isPassword
                            ? showPassword
                              ? "text"
                              : "password"
                            : type
                        }
                        placeholder={placeholder}
                        value={profile[name]}
                        onChange={(e) =>
                          setProfile({ ...profile, [name]: e.target.value })
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
                  )
                )}
                <button className={FULL_BUTTON}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
