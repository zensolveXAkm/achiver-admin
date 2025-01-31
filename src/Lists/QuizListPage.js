import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch quizzes from Firestore
  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "quizzes"));
        const fetchedQuizzes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuizzes(fetchedQuizzes);
      } catch (error) {
        alert("Error fetching quizzes: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Delete a quiz from Firestore
  const handleDeleteQuiz = async (quizId) => {
    try {
      await deleteDoc(doc(db, "quizzes", quizId));
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
      alert("Quiz deleted successfully!");
    } catch (error) {
      alert("Error deleting quiz: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Quiz List</h2>
      {isLoading ? (
        <p>Loading quizzes...</p>
      ) : quizzes.length > 0 ? (
        <div className="space-y-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">
                {`Topic: ${quiz.topic} | Class: ${quiz.class}`}
              </h3>
              <p>
                <strong>Question:</strong> {quiz.question}
              </p>
              <p>
                <strong>Options:</strong> 
                A) {quiz.options[0]}, B) {quiz.options[1]}, 
                C) {quiz.options[2]}, D) {quiz.options[3]}
              </p>
              <p>
                <strong>Correct Option:</strong> {quiz.correctOption}
              </p>
              <p>
                <strong>Time Per Question:</strong> {quiz.timePerQuestion} seconds
              </p>
              <button
                onClick={() => handleDeleteQuiz(quiz.id)}
                className="mt-4 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
              >
                Delete Quiz
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No quizzes available.</p>
      )}
    </div>
  );
};

export default QuizListPage;
