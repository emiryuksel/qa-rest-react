// src/components/QuestionCard.js

function QuestionCard({ title, excerpt, answerCount, date }) {
  return (
    <div className="bg-white dark:bg-neutral-800 dark:border dark:border-neutral-700 text-gray-800 dark:text-neutral-200 rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-gray-600 dark:text-neutral-400">{excerpt}</p>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-neutral-400">
        <span>{answerCount} answers</span>
        <span>{date}</span>
      </div>
    </div>
  );
}

export default QuestionCard;
