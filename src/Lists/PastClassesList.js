import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { IoTrashOutline } from "react-icons/io5"; // For the trash icon

const PastClassesList = () => {
  const [classes, setClasses] = useState([]);

  // Fetch classes from Firestore
  const fetchClasses = async () => {
    const querySnapshot = await getDocs(collection(db, "past_classes"));
    const classesList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setClasses(classesList);
  };

  // Delete a class from Firestore
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this past class?")) {
      try {
        await deleteDoc(doc(db, "past_classes", id));
        alert("Past class deleted successfully!");
        setClasses(classes.filter((classItem) => classItem.id !== id));
      } catch (error) {
        console.error("Error deleting class: ", error);
        alert("Failed to delete class.");
      }
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-xl font-semibold mb-4">Past Classes List</h2>
      <div className="space-y-4">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className="flex justify-between items-center border-b border-gray-300 py-4"
          >
            <div>
              <h3 className="font-semibold text-lg">{classItem.title}</h3>
              <p>{classItem.description}</p>
            </div>
            <button
              onClick={() => handleDelete(classItem.id)}
              className="text-red-500 hover:text-red-700"
            >
              <IoTrashOutline className="text-2xl" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastClassesList;
