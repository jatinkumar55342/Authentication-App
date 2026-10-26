import { useState } from 'react';

const ErrorMessage = ({ message }) => {
  const [visible, setVisible] = useState(true);

  if (!visible || !message) return null;

  return (
    <div
      className="flex items-center justify-between bg-red-500 text-white px-4 py-3 rounded-lg shadow-md mb-4"
      role="alert"
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="ml-4 text-white hover:text-red-100 focus:outline-none"
        aria-label="Dismiss error"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default ErrorMessage;
