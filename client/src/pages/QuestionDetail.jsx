// src/pages/QuestionDetail.jsx

import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { safeFetch } from "../utils/safeFetch";
import UserInfo from "../components/UserInfo";

function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload._id;
  } catch {
    return null;
  }
}

function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answerContent, setAnswerContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [liked, setLiked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Animasyon durumları
  const [loadingPage, setLoadingPage] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const currentUserId = getUserIdFromToken();

  const fetchQuestion = async () => {
    try {
      const res = await safeFetch(
        `${process.env.REACT_APP_API_BASE}/api/questions/${id}`
      );
      if (!res) return;
      const data = await res.json();
      setQuestion(data.data);
      const isLiked = data.data.likes?.includes(currentUserId);
      setLiked(isLiked);
    } catch (err) {
      console.error("Detay çekme hatası:", err);
    }
  };

  useEffect(() => {
    setLoadingPage(true);
    setShowContent(false);

    const fetchData = async () => {
      await fetchQuestion();
      setTimeout(() => {
        setShowContent(true);
        setLoadingPage(false);
      }, 150); // küçük gecikme animasyon için
    };

    fetchData();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!answerContent.trim()) {
      setErrorMessage("Answer cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await safeFetch(
        `${process.env.REACT_APP_API_BASE}/api/questions/${id}/answers`,
        {
          method: "POST",
          body: JSON.stringify({ content: answerContent }),
        }
      );

      if (!res) return;
      const result = await res.json();

      if (!res.ok) {
        const friendlyMsg =
          result.message?.includes("content") && result.message.includes("10")
            ? "Your answer must be at least 10 characters long."
            : result.message || "Failed to submit your answer.";
        setErrorMessage(friendlyMsg);
        return;
      }

      setAnswerContent("");
      await fetchQuestion();
    } catch (err) {
      setErrorMessage("Something went wrong while submitting your answer.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("Do you really want to delete this answer?")) return;
    try {
      const res = await safeFetch(
        `${process.env.REACT_APP_API_BASE}/api/questions/${id}/answers/${answerId}/delete`,
        { method: "DELETE" }
      );
      if (!res) return;
      await fetchQuestion();
    } catch (err) {
      alert("Error deleting answer: " + err.message);
    }
  };

  const handleEditAnswer = async (answerId) => {
    try {
      const res = await safeFetch(
        `${process.env.REACT_APP_API_BASE}/api/questions/${id}/answers/${answerId}/edit`,
        {
          method: "PUT",
          body: JSON.stringify({ content: editedContent }),
        }
      );
      if (!res || !res.ok) throw new Error("Failed to update answer");
      setEditingAnswerId(null);
      await fetchQuestion();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLikeQuestion = async () => {
    const endpoint = liked
      ? `${process.env.REACT_APP_API_BASE}/api/questions/${id}/undo_like`
      : `${process.env.REACT_APP_API_BASE}/api/questions/${id}/like`;

    try {
      const res = await safeFetch(endpoint);
      if (!res || !res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Action failed.");
        return;
      }

      setLiked(!liked);
      await fetchQuestion();
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const formattedDate = question?.createdAt
    ? new Date(question.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "No date";

  if (loadingPage || !question) {
    return (
      <div className="min-h-screen p-10 text-center text-neutral-500 dark:text-neutral-400">
        Loading question details...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-4 py-10 transition-opacity duration-500 ${
        showContent ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-md ring-1 ring-neutral-300/40 dark:ring-white/10 transition-all space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-white">
            {question.title}
          </h1>
          <p className="text-neutral-700 dark:text-neutral-300 mb-4">
            {question.content}
          </p>
          <div className="text-sm text-neutral-500 dark:text-neutral-400 space-y-1">
            <p>Created: {formattedDate}</p>
            <div className="flex items-center gap-2">
              <span>By:</span>
              <UserInfo user={question.user} size="small" />
            </div>
            <p>Answers: {question.answers?.length ?? 0}</p>
            <button
              onClick={handleLikeQuestion}
              className={`text-sm mt-2 hover:underline ${
                liked
                  ? "text-red-500"
                  : "text-neutral-500 dark:text-neutral-400"
              }`}
            >
              {liked ? "❤️ Liked" : "🤍 Like"} ({question.likeCount || 0})
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2 text-neutral-800 dark:text-white">
            Answers
          </h2>
          {question.answers && question.answers.length > 0 ? (
            question.answers.map((answer) => (
              <div
                key={answer._id}
                className="bg-neutral-100 dark:bg-neutral-700 p-4 rounded-xl text-sm text-neutral-800 dark:text-neutral-200 mb-3 shadow-sm ring-1 ring-neutral-300/30 dark:ring-white/10"
              >
                {editingAnswerId === answer._id ? (
                  <>
                    <textarea
                      className="w-full p-2 border rounded bg-white dark:bg-neutral-900 text-black dark:text-white"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div className="space-x-2 mt-2">
                      <button
                        onClick={() => handleEditAnswer(answer._id)}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingAnswerId(null)}
                        className="text-sm text-gray-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>{answer.content}</p>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-2">
                      <span>By:</span>
                      <UserInfo user={answer.user} size="small" />
                    </div>
                    {answer.user?._id === currentUserId && (
                      <div className="space-x-2 mt-1">
                        <button
                          onClick={() => {
                            setEditingAnswerId(answer._id);
                            setEditedContent(answer.content);
                          }}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAnswer(answer._id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              No answers yet.
            </p>
          )}
        </div>

        {errorMessage && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-2 rounded text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleAnswerSubmit} className="space-y-3">
          <textarea
            className="w-full p-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
            rows="4"
            placeholder="Write your answer..."
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm transition"
          >
            {loading ? "Submitting..." : "Submit Answer"}
          </button>
        </form>

        <div>
          <Link
            to="/"
            className="text-blue-500 hover:underline text-sm inline-block mt-6"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default QuestionDetail;
