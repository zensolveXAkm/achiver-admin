import React, { useState } from "react";
import { db } from "../firebase"; // Firebase configuration
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

const AddQuizPage = () => {
  const [topic, setTopic] = useState(""); // Topic input field
  const [bulkData, setBulkData] = useState(""); // For batch upload

  // Handle bulk quiz data upload
  const handleBulkSubmit = async () => {
    try {
      // Parse the input data as JSON
      const quizzes = JSON.parse(bulkData);
      // Loop through each quiz and add it to the Firestore under the topic document
      const topicRef = doc(db, "topics", topic); // Topic collection and document

      const updatedQuizzes = quizzes.map((quiz) => ({
        ...quiz,
        topic, // Add topic to each quiz
      }));

      // Create or update the topic document and add quizzes to the "questions" field
      await setDoc(topicRef, { quizzes: updatedQuizzes }, { merge: true });
      
      alert("All quizzes added successfully!");
      setBulkData(""); // Clear input after successful upload
    } catch (error) {
      alert("Error adding quizzes: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 space-y-8">
      {/* Topic Input Section */}
      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Select Topic</h2>
        <label className="block mb-2">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Bulk Upload Section */}
      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Bulk Upload Quizzes</h2>
        <label className="block mb-2">JSON Script (Array of Quizzes)</label>
        <textarea
          value={bulkData}
          onChange={(e) => setBulkData(e.target.value)}
          placeholder='[{"question": "Sample?", "optionA": "A", "optionB": "B", "optionC": "C", "optionD": "D", "correctAnswer": "A", "language": "English", "duration": "1:00", "passingMarks": 50}]'
          className="w-full border p-2 rounded"
          rows="10"
          required
        />
        <button
          onClick={handleBulkSubmit}
          className="mt-6 bg-green-600 text-white p-2 w-full rounded hover:bg-green-700"
        >
          Upload Bulk Quizzes
        </button>
      </div>
    </div>
  );
};

export default AddQuizPage;
