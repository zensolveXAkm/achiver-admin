import React from "react";

const NotesPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-3xl font-bold">Class Notes</h2>
      <p className="mt-4">Download or upload notes for your class below:</p>
      <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Upload Notes
      </button>
    </div>
  );
};

export default NotesPage;
