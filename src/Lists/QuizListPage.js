import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all quizzes from Firestore
  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "topics"));
        const topicsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuizzes(topicsData);
      } catch (error) {
        alert("Error fetching quizzes: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Delete a single quiz
  const handleDeleteQuiz = async (topicId, quizIndex) => {
    try {
      const topicRef = doc(db, "topics", topicId);
      const topic = quizzes.find((item) => item.id === topicId);
      const updatedQuizzes = topic.quizzes.filter((_, index) => index !== quizIndex);

      if (updatedQuizzes.length === 0) {
        // If no quizzes remain, delete the entire topic
        await deleteDoc(topicRef);
        setQuizzes((prev) => prev.filter((item) => item.id !== topicId));
      } else {
        // Otherwise, update the topic
        await updateDoc(topicRef, { quizzes: updatedQuizzes });
        setQuizzes((prev) =>
          prev.map((item) =>
            item.id === topicId ? { ...item, quizzes: updatedQuizzes } : item
          )
        );
      }

      alert("Quiz deleted successfully!");
    } catch (error) {
      alert("Error deleting quiz: " + error.message);
    }
  };

  // Delete an entire topic
  const handleDeleteTopic = async (topicId) => {
    try {
      await deleteDoc(doc(db, "topics", topicId));
      setQuizzes((prev) => prev.filter((item) => item.id !== topicId));
      alert("Topic deleted successfully!");
    } catch (error) {
      alert("Error deleting topic: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">Quiz List</h2>
      {isLoading ? (
        <p>Loading quizzes...</p>
      ) : (
        <div className="space-y-8">
          {quizzes.map((topic) => (
            <div key={topic.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4">
                {`Class: ${topic.id.split("_")[0]} | Topic: ${topic.id.split("_")[1]}`}
              </h3>
              <button
                onClick={() => handleDeleteTopic(topic.id)}
                className="bg-red-600 text-white py-1 px-4 rounded mb-4"
              >
                Delete Entire Topic
              </button>
              <div className="space-y-4">
                {topic.quizzes.map((quiz, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p>
                        <strong>Q:</strong> {quiz.question}
                      </p>
                      <p>
                        <strong>Options:</strong> A) {quiz.optionA}, B){" "}
                        {quiz.optionB}, C) {quiz.optionC}, D) {quiz.optionD}
                      </p>
                      <p>
                        <strong>Correct Answer:</strong> {quiz.correctAnswer}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteQuiz(topic.id, index)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                      Delete Quiz
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizListPage;
