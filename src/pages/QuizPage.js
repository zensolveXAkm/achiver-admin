import React, { useState } from "react";
import { db } from "../firebase"; // Firestore instance
import { collection, addDoc } from "firebase/firestore";

const BulkQuizForm = () => {
  const [formData, setFormData] = useState({
    topic: "",
    class: "",
    timePerQuestion: 30, // Default time per question in seconds
    jsonScript: "", // Store the JSON input
  });

  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle bulk quiz upload from JSON script
  const handleUpload = async (e) => {
    e.preventDefault();
    const { topic, class: className, jsonScript, timePerQuestion } = formData;

    // Validate inputs
    if (!topic || !className || !jsonScript) {
      setMessage("Please fill in all fields and provide the JSON script.");
      return;
    }

    try {
      const questionsData = JSON.parse(jsonScript); // Parse the JSON script

      // Validate the JSON structure
      if (!Array.isArray(questionsData)) {
        setMessage("The JSON script should contain an array of questions.");
        return;
      }

      // Upload each question under the topic and class
      for (const question of questionsData) {
        const { questionText, options, correctOption } = question;

        if (!questionText || !options || options.length !== 4 || !correctOption) {
          setMessage("Each question should contain text, 4 options, and a correct option.");
          return;
        }

        const quizData = {
          topic,
          class: className,
          question: questionText,
          options,
          correctOption,
          timePerQuestion: timePerQuestion,
        };

        // Add quiz data to Firestore
        await addDoc(collection(db, "quizzes"), quizData);
      }

      setMessage("Quizzes uploaded successfully!");
      setFormData({
        topic: "",
        class: "",
        timePerQuestion: 30,
        jsonScript: "",
      });
    } catch (error) {
      setMessage("Error uploading quizzes: " + error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Bulk Upload Quizzes
      </h2>

      {/* Topic */}
      <label className="block mb-2 font-semibold text-gray-700">Topic</label>
      <input
        type="text"
        name="topic"
        value={formData.topic}
        onChange={handleChange}
        className="border p-2 w-full rounded mb-4"
        placeholder="Enter the topic (e.g., Math, Science)"
        required
      />

      {/* Class */}
      <label className="block mb-2 font-semibold text-gray-700">Class</label>
      <select
        name="class"
        value={formData.class}
        onChange={handleChange}
        className="border p-2 w-full rounded mb-4"
        required
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

      {/* Time per question */}
      <label className="block mb-2 font-semibold text-gray-700">Time per question (in seconds)</label>
      <input
        type="number"
        name="timePerQuestion"
        value={formData.timePerQuestion}
        onChange={handleChange}
        className="border p-2 w-full rounded mb-4"
        placeholder="Enter time in seconds"
        min="5"
        required
      />

      {/* JSON Script Input */}
      <label className="block mb-2 font-semibold text-gray-700">Paste Quiz JSON Script</label>
      <textarea
        name="jsonScript"
        value={formData.jsonScript}
        onChange={handleChange}
        className="border p-2 w-full rounded mb-4"
        rows="10"
        placeholder="Paste your quiz JSON script here..."
        required
      ></textarea>

      {/* Message */}
      {message && (
        <div className="text-center text-sm text-gray-700 mt-4">
          <p>{message}</p>
        </div>
      )}

      {/* Upload Button */}
      <button
        type="submit"
        onClick={handleUpload}
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full hover:bg-blue-700"
      >
        Upload Quizzes
      </button>
    </div>
  );
};

export default BulkQuizForm;
