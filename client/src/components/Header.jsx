import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

function Header({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true); // varsayılan dark

  // İlk yüklemede localStorage kontrol et
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDark(false);
    } else {
      setIsDark(true);
    }
  }, []);

  // isDark değişince class ve localStorage ayarı
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/", { state: { reload: true } });
  };

  return (
    <header className="bg-black shadow-sm p-4 flex justify-between items-center">
      <Link to="/" className="text-lg font-semibold text-white">
        Question Answer Site
      </Link>

      <div className="flex items-center gap-4">
        <nav className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/add-question"
                className="text-neutral-400 text-sm hover:text-white transition"
              >
                Add Question
              </Link>
              <Link
                to="/profile"
                className="text-neutral-400 text-sm hover:text-white transition"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-400 text-sm hover:underline"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-neutral-400 text-sm hover:text-white transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="text-neutral-400 text-sm hover:text-white transition"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}

export default Header;
