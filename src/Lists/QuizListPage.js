import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const QuizListPage = () => {
  const [quizzesByTopic, setQuizzesByTopic] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch quizzes from Firestore and group by topic
  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "quizzes"));
        const quizzes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Group quizzes by topic
        const groupedData = quizzes.reduce((acc, quiz) => {
          const topicKey = `${quiz.class} - ${quiz.topic}`;
          if (!acc[topicKey]) {
            acc[topicKey] = [];
          }
          acc[topicKey].push(quiz);
          return acc;
        }, {});

        setQuizzesByTopic(groupedData);
      } catch (error) {
        alert("Error fetching quizzes: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Delete an individual quiz
  const handleDeleteQuiz = async (topicKey, quizId) => {
    try {
      await deleteDoc(doc(db, "quizzes", quizId));
      setQuizzesByTopic((prev) => {
        const updatedTopicQuizzes = prev[topicKey].filter((quiz) => quiz.id !== quizId);
        if (updatedTopicQuizzes.length === 0) {
          const { [topicKey]: _, ...remainingTopics } = prev;
          return remainingTopics;
        }
        return { ...prev, [topicKey]: updatedTopicQuizzes };
      });
      alert("Quiz deleted successfully!");
    } catch (error) {
      alert("Error deleting quiz: " + error.message);
    }
  };

  // Delete an entire topic
  const handleDeleteTopic = async (topicKey) => {
    try {
      const quizzes = quizzesByTopic[topicKey];
      for (const quiz of quizzes) {
        await deleteDoc(doc(db, "quizzes", quiz.id));
      }
      setQuizzesByTopic((prev) => {
        const { [topicKey]: _, ...remainingTopics } = prev;
        return remainingTopics;
      });
      alert("Topic and all its quizzes deleted successfully!");
    } catch (error) {
      alert("Error deleting topic: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Quiz List</h2>
      {isLoading ? (
        <p>Loading quizzes...</p>
      ) : Object.keys(quizzesByTopic).length > 0 ? (
        <div className="space-y-8">
          {Object.keys(quizzesByTopic).map((topicKey) => (
            <div key={topicKey} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-blue-700 mb-4">
                {`Topic: ${topicKey}`}
              </h3>
              <button
                onClick={() => handleDeleteTopic(topicKey)}
                className="bg-red-600 text-white py-1 px-4 rounded mb-4"
              >
                Delete Entire Topic
              </button>
              <div className="space-y-4">
                {quizzesByTopic[topicKey].map((quiz) => (
                  <div
                    key={quiz.id}
                    className="border p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p>
                        <strong>Q:</strong> {quiz.question}
                      </p>
                      <p>
                        <strong>Options:</strong> A) {quiz.options[0]}, B) {quiz.options[1]}, 
                        C) {quiz.options[2]}, D) {quiz.options[3]}
                      </p>
                      <p>
                        <strong>Correct Option:</strong> {quiz.correctOption}
                      </p>
                      <p>
                        <strong>Time Per Question:</strong> {quiz.timePerQuestion} seconds
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteQuiz(topicKey, quiz.id)}
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
      ) : (
        <p>No quizzes available.</p>
      )}
    </div>
  );
};

export default QuizListPage;
