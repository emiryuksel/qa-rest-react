import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { safeFetch } from "../utils/safeFetch";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const redirected = new URLSearchParams(location.search).get("redirected");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await safeFetch(
        `${process.env.REACT_APP_API_BASE}/api/auth/login`,
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res) return;

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed.");

      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      navigate("/", { state: { reload: true } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-100 dark:bg-neutral-900 transition-colors">
      <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-md w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white">
          Log In
        </h2>

        {redirected === "true" && (
          <p className="text-yellow-600 dark:text-yellow-400 text-sm text-center">
            You must log in to perform this action.
          </p>
        )}
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        <Link
          to="/forgot-password"
          className="text-sm text-blue-500 hover:underline block text-center"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}

export default Login;
