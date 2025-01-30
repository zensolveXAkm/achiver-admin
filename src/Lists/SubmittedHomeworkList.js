import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

const HomeworkTreeView = () => {
  const [homeworkList, setHomeworkList] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchHomework = async () => {
      const querySnapshot = await getDocs(collection(db, "homework"));
      const homeworkData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHomeworkList(homeworkData);
    };
    fetchHomework();
  }, []);

  const toggleExpand = async (homeworkId) => {
    if (expanded[homeworkId]) {
      setExpanded((prev) => ({ ...prev, [homeworkId]: null }));
    } else {
      try {
        const submissionsRef = collection(db, "homework_submissions");
        const q = query(submissionsRef, where("homeworkId", "==", homeworkId));
        const querySnapshot = await getDocs(q);
        const submissionData = querySnapshot.docs.map((doc) => doc.data());
        setExpanded((prev) => ({ ...prev, [homeworkId]: submissionData }));
      } catch (error) {
        console.error("Error fetching submissions:", error.message);
      }
    }
  };

  const handleDeleteHomework = async (homeworkId) => {
    try {
      const homeworkDocRef = doc(db, "homework", homeworkId);
      await deleteDoc(homeworkDocRef);
      setHomeworkList((prevList) => prevList.filter((hw) => hw.id !== homeworkId));
      alert("Homework deleted successfully!");
    } catch (error) {
      console.error("Error deleting homework:", error.message);
      alert("Failed to delete homework.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Homework Submissions</h2>
      {homeworkList.length === 0 ? (
        <p>No homework available.</p>
      ) : (
        homeworkList.map((hw) => (
          <div key={hw.id} className="p-4 bg-white shadow rounded mb-4">
            <div onClick={() => toggleExpand(hw.id)} className="cursor-pointer">
              <h3 className="text-xl font-semibold">{hw.topic}</h3>
              <p>{hw.description}</p>
              <p className="text-gray-600">Due: {hw.dueDate}</p>
            </div>
            <div className="mt-2">
              <button
                onClick={() => handleDeleteHomework(hw.id)}
                className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
              >
                Dismiss Homework
              </button>
            </div>
            {expanded[hw.id] && (
              <div className="ml-4 mt-2 border-l-2 pl-4">
                {expanded[hw.id].length === 0 ? (
                  <p>No submissions for this topic.</p>
                ) : (
                  expanded[hw.id].map((sub, index) => (
                    <div key={index} className="p-2 bg-gray-100 rounded mb-2">
                      <p className="font-semibold">Name: {sub.name}</p>
                      <p>Email: {sub.email}</p>
                      <p>Remarks: {sub.remarks || "No remarks"}</p>
                      <a
                        href={sub.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Attachment
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default HomeworkTreeView;
