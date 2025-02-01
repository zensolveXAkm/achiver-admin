import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Modal from "react-modal";

Modal.setAppElement("#root");

const QuizListPage = () => {
  const [quizzesByTopic, setQuizzesByTopic] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [editQuizModal, setEditQuizModal] = useState(false);
  const [editTopicModal, setEditTopicModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedTopicKey, setSelectedTopicKey] = useState("");
  const [updatedQuizData, setUpdatedQuizData] = useState({});
  const [updatedTopicTitle, setUpdatedTopicTitle] = useState("");

  // Fetch quizzes from Firestore
  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "quizzes"));
        const quizzes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const groupedData = quizzes.reduce((acc, quiz) => {
          const topicKey = `${quiz.class} - ${quiz.topic}`;
          if (!acc[topicKey]) acc[topicKey] = [];
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

  const handleEditQuiz = (quiz, topicKey) => {
    setSelectedQuiz(quiz);
    setUpdatedQuizData({ ...quiz });
    setSelectedTopicKey(topicKey);
    setEditQuizModal(true);
  };

  const handleSaveQuiz = async () => {
    try {
      await updateDoc(doc(db, "quizzes", selectedQuiz.id), updatedQuizData);
      alert("Quiz updated successfully!");
      setEditQuizModal(false);
      setQuizzesByTopic((prev) => {
        const updatedQuizzes = prev[selectedTopicKey].map((quiz) =>
          quiz.id === selectedQuiz.id ? { ...updatedQuizData } : quiz
        );
        return { ...prev, [selectedTopicKey]: updatedQuizzes };
      });
    } catch (error) {
      alert("Error updating quiz: " + error.message);
    }
  };

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

  const handleEditTopic = (topicKey) => {
    setSelectedTopicKey(topicKey);
    setUpdatedTopicTitle(topicKey);
    setEditTopicModal(true);
  };

  const handleSaveTopic = async () => {
    try {
      const quizzes = quizzesByTopic[selectedTopicKey];
      const newClass = updatedTopicTitle.split(" - ")[0];
      const newTopic = updatedTopicTitle.split(" - ")[1];
      for (const quiz of quizzes) {
        await updateDoc(doc(db, "quizzes", quiz.id), { class: newClass, topic: newTopic });
      }
      alert("Topic updated successfully!");
      setEditTopicModal(false);
    } catch (error) {
      alert("Error updating topic: " + error.message);
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
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-blue-700">
                  {`Topic: ${topicKey}`}
                </h3>
                <button
                  onClick={() => handleEditTopic(topicKey)}
                  className="bg-yellow-400 text-black py-1 px-4 rounded mr-2"
                >
                  Edit Topic
                </button>
                <button
                  onClick={() => handleDeleteTopic(topicKey)}
                  className="bg-red-600 text-white py-1 px-4 rounded"
                >
                  Delete Entire Topic
                </button>
              </div>

              <div className="space-y-4 mt-4">
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
                        <strong>Options:</strong> A) {quiz.options[0]}, B) {quiz.options[1]}, C) {quiz.options[2]}, D) {quiz.options[3]}
                      </p>
                      <p>
                        <strong>Correct Option:</strong> {quiz.correctOption}
                      </p>
                      <p>
                        <strong>Time Per Question:</strong> {quiz.timePerQuestion} seconds
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleEditQuiz(quiz, topicKey)}
                        className="bg-yellow-400 text-black py-1 px-3 rounded mr-2"
                      >
                        Edit Quiz
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(topicKey, quiz.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      >
                        Delete Quiz
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No quizzes available.</p>
      )}

      {/* Edit Quiz Modal */}
      <Modal
        isOpen={editQuizModal}
        onRequestClose={() => setEditQuizModal(false)}
        className="bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-10"
      >
        <h3 className="text-lg font-semibold mb-4">Edit Quiz</h3>
        <div>
          <label>Question</label>
          <input
            type="text"
            value={updatedQuizData.question || ""}
            onChange={(e) =>
              setUpdatedQuizData({ ...updatedQuizData, question: e.target.value })
            }
            className="w-full border rounded p-2 mb-4"
          />
          <label>Options</label>
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              type="text"
              value={updatedQuizData.options?.[index] || ""}
              onChange={(e) => {
                const updatedOptions = [...updatedQuizData.options];
                updatedOptions[index] = e.target.value;
                setUpdatedQuizData({ ...updatedQuizData, options: updatedOptions });
              }}
              placeholder={`Option ${index + 1}`}
              className="w-full border rounded p-2 mb-2"
            />
          ))}
          <label>Correct Option</label>
          <input
            type="text"
            value={updatedQuizData.correctOption || ""}
            onChange={(e) =>
              setUpdatedQuizData({ ...updatedQuizData, correctOption: e.target.value })
            }
            className="w-full border rounded p-2 mb-4"
          />
          <label>Time Per Question</label>
          <input
            type="number"
            value={updatedQuizData.timePerQuestion || ""}
            onChange={(e) =>
              setUpdatedQuizData({ ...updatedQuizData, timePerQuestion: e.target.value })
            }
            className="w-full border rounded p-2 mb-4"
          />
          <button
            onClick={handleSaveQuiz}
            className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
          >
            Save Changes
          </button>
          <button
            onClick={() => setEditQuizModal(false)}
            className="bg-gray-400 text-white py-1 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Edit Topic Modal */}
      <Modal
        isOpen={editTopicModal}
        onRequestClose={() => setEditTopicModal(false)}
        className="bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-10"
      >
        <h3 className="text-lg font-semibold mb-4">Edit Topic</h3>
        <input
          type="text"
          value={updatedTopicTitle}
          onChange={(e) => setUpdatedTopicTitle(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />
        <button
          onClick={handleSaveTopic}
          className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
        >
          Save Changes
        </button>
        <button
          onClick={() => setEditTopicModal(false)}
          className="bg-gray-400 text-white py-1 px-4 rounded"
        >
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default QuizListPage;
