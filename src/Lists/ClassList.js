import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const ClassList = () => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLiveClasses = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "liveClasses"));
      const classes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLiveClasses(classes);
    } catch (error) {
      console.error("Error fetching live classes: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this class?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "liveClasses", id));
        alert("Class deleted successfully!");
        setLiveClasses(liveClasses.filter((liveClass) => liveClass.id !== id));
      } catch (error) {
        console.error("Error deleting class: ", error.message);
        alert("Failed to delete class.");
      }
    }
  };

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Live Classes</h2>
      {liveClasses.length === 0 ? (
        <p>No classes available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveClasses.map((liveClass) => (
            <div
              key={liveClass.id}
              className="bg-white p-4 shadow-lg rounded-lg"
            >
              <img
                src={liveClass.thumbnail}
                alt="Thumbnail"
                className="w-full h-40 object-cover rounded-lg"
              />
              <h3 className="mt-4 text-lg font-bold">{liveClass.topic}</h3>
              <p className="text-sm text-gray-600">Class: {liveClass.class}</p>
              <p className="text-sm text-gray-600">
                Start: {new Date(liveClass.startDateTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                End: {new Date(liveClass.endDateTime).toLocaleString()}
              </p>
              <a
                href={liveClass.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 block"
              >
                Join Class
              </a>
              <button
                onClick={() => handleDelete(liveClass.id)}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassList;
