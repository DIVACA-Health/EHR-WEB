import React from "react";

const Modal1 = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 bg-opacity-10 backdrop-blur-md flex items-center justify-center z-30">
      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-96 text-center relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>

        {/* Modal GIF Placeholder */}
        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-600">There is a GIF Here</span>
        </div>

        {/* Modal Title */}
        <h2 className="mt-4 text-xl font-semibold">
          Success 🎉
        </h2>

        {/* Modal Text */}
        <p className="mt-2 text-gray-600">
            Your password has been reset successfully
        </p>

        {/* Go to Dashboard Button */}
        <button
          className="mt-6 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          onClick={onClose}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default Modal1;
