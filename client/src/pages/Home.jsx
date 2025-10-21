import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function Home() {
  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sortBy") || "newest";

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE}/api/questions?page=${page}&limit=5&sortBy=${sortBy}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch data");

        setQuestions(data.data || []);
        setPagination(data.pagination || {});
      } catch (err) {
        setError(err.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [page, sortBy]);

  const goToPage = (pageNum) => {
    setSearchParams({ page: pageNum, sortBy });
  };

  const changeSort = (newSort) => {
    setSearchParams({ page: 1, sortBy: newSort });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-900 dark:text-dark-text">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Questions</h1>
        <div className="space-x-2 text-sm">
          {["newest", "most-liked", "most-answered"].map((sort) => (
            <button
              key={sort}
              onClick={() => changeSort(sort)}
              className={`px-3 py-1 rounded-full transition font-medium ${
                sortBy === sort
                  ? "bg-dark-primary text-white"
                  : "bg-gray-200 text-gray-700 dark:bg-dark-subtle dark:text-dark-text"
              }`}
            >
              {sort
                .replace("newest", "Newest")
                .replace("most-liked", "Most Liked")
                .replace("most-answered", "Most Answered")}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white dark:bg-dark-card rounded-xl p-6 shadow-md border border-gray-200 dark:border-dark-border"
            >
              <div className="h-4 bg-gray-300 dark:bg-dark-subtle rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-1/4 mb-1" />
              <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : questions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No questions yet.</p>
      ) : (
        questions.map((q) => (
          <div
            key={q._id}
            className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-md hover:shadow-lg transition mb-4 border border-gray-200 dark:border-dark-border"
          >
            <h2 className="text-lg font-semibold mb-1">{q.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              By: {q.user?.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-500">
              Answers: {q.answerCount ?? 0} | Likes: {q.likeCount ?? 0}
            </p>
            <Link
              to={`/questions/${q._id}`}
              className="text-sm text-dark-primary hover:underline mt-2 inline-block"
            >
              View Question
            </Link>
          </div>
        ))
      )}

      {!loading && (
        <div className="flex justify-between mt-6">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={!pagination.previous}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-dark-subtle text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-dark-border disabled:opacity-40 transition"
          >
            Previous
          </button>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={!pagination.next}
            className="px-4 py-2 rounded bg-dark-primary text-white hover:bg-blue-700 disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
