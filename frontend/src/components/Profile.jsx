import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  BACK_BUTTON,
  DANGER_BTN,
  FULL_BUTTON,
  INPUT_WRAPPER,
  personalFields,
  SECTION_WRAPPER,
  securityFields,
} from "../assets/constant";
import {
  ChevronLeft,
  Save,
  UserCircle,
  Eye,
  EyeOff,
  Shield,
  Lock,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = ({ user, setCurrentUser, onLogout }) => {
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000";
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

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
  };
  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_URL}/api/user/password`,
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success("Password changed successfully");
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error changing password");
    }
  };

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
                  ({ name, type, placeholder, icon: Icon }) => (
                    <div key={name} className={INPUT_WRAPPER}>
                      <Icon className="text-rose-500 w-5 h-5 mr-2" />
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={profile[name]}
                        onChange={(e) =>
                          setProfile({ ...profile, [name]: e.target.value })
                        }
                        className="w-full focus:outline-none text-sm text-gray-700"
                        required
                      />
                    </div>
                  )
                )}

                <button className={FULL_BUTTON}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </form>
            </section>

            <section className={SECTION_WRAPPER}>
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-rose-600" />
                <h2 className="text-xl font-semi-bold text-gray-800">
                  Security
                </h2>
              </div>

              <form onSubmit={changePassword} className="space-y-4">
                {securityFields.map(({ name, placeholder }) => (
                  <div
                    key={name}
                    className={`${INPUT_WRAPPER} flex items-center`}
                  >
                    <Lock className="text-rose-500 w-5 h-5 mr-2" />
                    <input
                      type={showPassword[name] ? "text" : "password"}
                      placeholder={placeholder}
                      value={passwords[name]}
                      onChange={(e) =>
                        setPasswords({ ...passwords, [name]: e.target.value })
                      }
                      className="w-full focus:outline-none text-sm text-gray-700"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          [name]: !prev[name],
                        }))
                      }
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword[name] ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                ))}

                <button className={FULL_BUTTON}>
                  <Save className="w-4 h-4 mr-2" />
                  Change Password
                </button>

                <div className="mt-8 pt-6 border-t border-purple-100">
                  <button
                    className={`${DANGER_BTN} flex items-center justify-around`}
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4 ml-6 text-red-600 font-semibold" />
                    <h3 className="text-sm font-medium mr-6">Logout</h3>
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
