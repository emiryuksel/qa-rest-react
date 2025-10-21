import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { safeFetch } from "../utils/safeFetch";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await safeFetch(
        `${process.env.REACT_APP_API_BASE}/api/auth/register`,
        {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        }
      );

      if (!res) return;
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed.");

      localStorage.setItem("token", data.token);
      navigate("/", { state: { reload: true } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-100 dark:bg-neutral-900 transition-colors">
      <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-md w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white">
          Create Account
        </h2>
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </p>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 border rounded bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
