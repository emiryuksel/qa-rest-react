import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const token = new URLSearchParams(useLocation().search).get("token");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/auth/resetpassword?resetPasswordToken=${token}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error("Unexpected server response: " + text);
      }

      if (!res.ok) throw new Error(data.message || "Reset failed.");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-100 dark:bg-neutral-900 transition-colors">
      <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-md w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white">
          Set New Password
        </h2>

        {success && (
          <p className="text-green-600 dark:text-green-400 text-sm text-center">
            Password updated. Redirecting to login...
          </p>
        )}
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 border rounded bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
