import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { safeFetch } from "../utils/safeFetch";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await safeFetch(
        `${process.env.REACT_APP_API_BASE}/api/auth/me`
      );
      const data = await res.json();
      setUser(data.data);
      setName(data.data.name);
    } catch (err) {
      setError("Failed to fetch user: " + err.message);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login?redirected=true");
      return;
    }
    fetchUser();
  }, [navigate]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const res = await safeFetch(
        `${process.env.REACT_APP_API_BASE}/api/auth/change-password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password update failed.");
      setMessage("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNameChange = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const res = await safeFetch(
        `${process.env.REACT_APP_API_BASE}/api/auth/edit`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Name update failed.");
      setMessage("Name updated successfully.");
      await fetchUser();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append("profile_image", e.target.profile_image.files[0]);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/auth/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed.");
      setMessage("Profile photo updated.");
      await fetchUser();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen px-4 pt-20 pb-12 bg-neutral-100 dark:bg-neutral-900 transition-colors">
      <div className="p-6 w-full max-w-md mx-auto bg-white dark:bg-neutral-800 rounded-2xl shadow space-y-6 transition-all">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          My Profile
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}

        {user && (
          <div className="space-y-3 text-center">
            <img
              src={`${process.env.REACT_APP_API_BASE}/uploads/${
                user.profile_image || "default.jpg"
              }`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mx-auto border border-gray-300 dark:border-gray-600"
            />
            <p className="text-neutral-700 dark:text-neutral-200">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        )}

        <hr className="border-neutral-300 dark:border-neutral-700" />

        <form
          onSubmit={handleImageUpload}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <h3 className="text-md font-semibold text-neutral-800 dark:text-neutral-200">
            Upload Profile Picture
          </h3>
          <input
            type="file"
            name="profile_image"
            accept="image/*"
            className="w-full p-2 border rounded bg-white dark:bg-neutral-900 text-sm text-neutral-800 dark:text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Upload
          </button>
        </form>

        <hr className="border-neutral-300 dark:border-neutral-700" />

        <form onSubmit={handleNameChange} className="space-y-4">
          <h3 className="text-md font-semibold text-neutral-800 dark:text-neutral-200">
            Change Your Name
          </h3>
          <input
            type="text"
            placeholder="New Name"
            className="w-full p-2 border rounded bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Update Name
          </button>
        </form>

        <hr className="border-neutral-300 dark:border-neutral-700" />

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <h3 className="text-md font-semibold text-neutral-800 dark:text-neutral-200">
            Change Password
          </h3>
          <input
            type="password"
            placeholder="Current Password"
            className="w-full p-2 border rounded bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 border rounded bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
