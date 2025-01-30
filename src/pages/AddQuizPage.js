import React, { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const AddQuizPage = () => {
  const [topic, setTopic] = useState("");
  const [quizClass, setQuizClass] = useState("");
  const [bulkData, setBulkData] = useState("");

  const handleBulkSubmit = async () => {
    try {
      if (!quizClass || !topic) {
        alert("Please select a class and enter a topic.");
        return;
      }
      const quizzes = JSON.parse(bulkData);
      const documentId = `${quizClass}_${topic}`; // Unique document ID
      const topicRef = doc(db, "topics", documentId);

      const updatedQuizzes = quizzes.map((quiz) => ({
        ...quiz,
        topic,
        class: quizClass,
      }));

      await setDoc(topicRef, { quizzes: updatedQuizzes }, { merge: true });
      alert("All quizzes added successfully!");
      setBulkData("");
    } catch (error) {
      alert("Error adding quizzes: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 space-y-8">
      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Quiz</h2>
        <label className="block mb-2">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <label className="block mt-4">Class</label>
        <select
          value={quizClass}
          onChange={(e) => setQuizClass(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select a class</option>
          <option value="VIII">VIII</option>
          <option value="IX">IX</option>
          <option value="X">X</option>
          <option value="XI">XI</option>
          <option value="XII">XII</option>
          <option value="UPSC">UPSC</option>
          <option value="SSC">SSC</option>
          <option value="BANKING">BANKING</option>
          <option value="CLAT">CLAT</option>
          <option value="CAT">CAT</option>
          <option value="MAT">MAT</option>
          <option value="XAT">XAT</option>
          <option value="CUET">CUET</option>
          <option value="GENERAL">General</option>

        </select>
      </div>

      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Bulk Upload Quizzes</h2>
        <textarea
          value={bulkData}
          onChange={(e) => setBulkData(e.target.value)}
          placeholder='[{"question": "Sample?", "optionA": "A", "optionB": "B", "optionC": "C", "optionD": "D", "correctAnswer": "A"}]'
          className="w-full border p-2 rounded"
          rows="10"
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
