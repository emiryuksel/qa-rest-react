import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { safeFetch } from "../utils/safeFetch";

function AddQuestion() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("You must be logged in to post a question.");
      return;
    }

    try {
      const res = await safeFetch(
        `${process.env.REACT_APP_API_BASE}/api/questions/ask`,
        {
          method: "POST",
          body: JSON.stringify({ title, content }),
        }
      );

      if (!res) return;

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to post question.");
      }

      navigate("/", { state: { reload: true } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen px-4 pt-20 pb-12 bg-neutral-100 dark:bg-neutral-900 transition-colors">
      <div className="max-w-xl mx-auto bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow space-y-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Ask a New Question
        </h2>

        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Question Title"
            className="w-full p-3 border rounded bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Question details"
            className="w-full p-3 border rounded min-h-[120px] bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Question
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddQuestion;
