import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

const ClassList = () => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [updatedClass, setUpdatedClass] = useState({
    topic: "",
    class: "",
    startDateTime: "",
    endDateTime: "",
    link: "",
    thumbnail: "",
  });

  // Fetch live classes from Firestore
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

  // Delete image from Cloudinary
  const deleteImageFromCloudinary = async (publicId) => {
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dkzczonkz/image/destroy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            public_id: publicId,
            api_key: "588654794854165", // Replace with your Cloudinary API key
            api_secret: "84S3yWtVQl971TujeXQl9RXuflM", // Replace with your Cloudinary API secret
            timestamp: Math.floor(Date.now() / 1000),
          }),
        }
      );
      const data = await response.json();
      if (data.result === "ok") {
        console.log("Image deleted from Cloudinary");
      } else {
        console.error("Failed to delete image from Cloudinary:", data);
      }
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error.message);
    }
  };

  // Handle class deletion
  const handleDelete = async (id, thumbnailPublicId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this class?");
    if (confirmDelete) {
      try {
        // Delete image from Cloudinary
        if (thumbnailPublicId) {
          await deleteImageFromCloudinary(thumbnailPublicId);
        }

        // Delete document from Firestore
        await deleteDoc(doc(db, "liveClasses", id));
        alert("Class deleted successfully!");
        setLiveClasses(liveClasses.filter((liveClass) => liveClass.id !== id));
      } catch (error) {
        console.error("Error deleting class: ", error.message);
        alert("Failed to delete class.");
      }
    }
  };

  // Handle opening the edit modal
  const handleEdit = (liveClass) => {
    setSelectedClass(liveClass);
    setUpdatedClass({
      topic: liveClass.topic,
      class: liveClass.class,
      startDateTime: liveClass.startDateTime,
      endDateTime: liveClass.endDateTime,
      link: liveClass.link,
      thumbnail: liveClass.thumbnail,
    });
    setIsModalOpen(true);
  };

  // Handle modal close
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  // Handle updating class data
  const handleUpdate = async () => {
    if (selectedClass) {
      try {
        const classRef = doc(db, "liveClasses", selectedClass.id);
        await updateDoc(classRef, updatedClass);
        alert("Class updated successfully!");
        fetchLiveClasses();
        closeModal();
      } catch (error) {
        console.error("Error updating class: ", error.message);
        alert("Failed to update class.");
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
            <div key={liveClass.id} className="bg-white p-4 shadow-lg rounded-lg">
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
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(liveClass)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(liveClass.id, liveClass.thumbnailPublicId)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Live Class</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">Topic</label>
                <input
                  type="text"
                  value={updatedClass.topic}
                  onChange={(e) => setUpdatedClass({ ...updatedClass, topic: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">Class</label>
                <input
                  type="text"
                  value={updatedClass.class}
                  onChange={(e) => setUpdatedClass({ ...updatedClass, class: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={updatedClass.startDateTime}
                  onChange={(e) =>
                    setUpdatedClass({ ...updatedClass, startDateTime: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={updatedClass.endDateTime}
                  onChange={(e) =>
                    setUpdatedClass({ ...updatedClass, endDateTime: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">Class Link</label>
                <input
                  type="text"
                  value={updatedClass.link}
                  onChange={(e) => setUpdatedClass({ ...updatedClass, link: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">Thumbnail URL</label>
                <input
                  type="text"
                  value={updatedClass.thumbnail}
                  onChange={(e) => setUpdatedClass({ ...updatedClass, thumbnail: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassList;