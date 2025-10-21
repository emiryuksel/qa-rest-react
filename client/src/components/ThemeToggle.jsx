// src/components/ThemeToggle.tsx
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <label className="relative inline-block w-16 h-9 cursor-pointer">
      <input
        type="checkbox"
        className="opacity-0 w-0 h-0 peer"
        checked={isDark}
        onChange={toggleTheme}
      />
      <div
        className={`absolute inset-0 rounded-full transition-colors duration-300
          ${isDark ? "bg-neutral-700" : "bg-gray-300"}`}
      />
      <div
        className={`absolute left-1 top-1 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm
          transition-all duration-300 transform peer-checked:translate-x-7
          ${isDark ? "bg-dark-primary" : "bg-dark-primary"}`}
      >
        {isDark ? <FaMoon size={14} /> : <FaSun size={14} />}
      </div>
    </label>
  );
};

export default ThemeToggle;
