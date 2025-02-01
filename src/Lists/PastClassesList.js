import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { IoTrashOutline, IoCreateOutline } from "react-icons/io5"; // For trash and edit icons
import Modal from "react-modal";

Modal.setAppElement("#root"); // Ensure accessibility for the modal

const PastClassesList = () => {
  const [classes, setClasses] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Fetch classes from Firestore
  const fetchClasses = async () => {
    const querySnapshot = await getDocs(collection(db, "past_classes"));
    const classesList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setClasses(classesList);
  };

  // Handle form changes for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
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

  // Open the edit modal
  const openEditModal = (classItem) => {
    setSelectedClass(classItem);
    setEditFormData(classItem);
    setIsEditModalOpen(true);
  };

  // Close the edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedClass(null);
  };

  // Update a class in Firestore
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const classDoc = doc(db, "past_classes", selectedClass.id);
      await updateDoc(classDoc, editFormData);
      alert("Class updated successfully!");

      // Update the UI with the updated data
      setClasses(
        classes.map((classItem) =>
          classItem.id === selectedClass.id ? { ...classItem, ...editFormData } : classItem
        )
      );
      closeEditModal();
    } catch (error) {
      console.error("Error updating class: ", error);
      alert("Failed to update class.");
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => openEditModal(classItem)}
                className="text-blue-500 hover:text-blue-700"
              >
                <IoCreateOutline className="text-2xl" />
              </button>
              <button
                onClick={() => handleDelete(classItem.id)}
                className="text-red-500 hover:text-red-700"
              >
                <IoTrashOutline className="text-2xl" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Class Modal"
        className="bg-white p-6 max-w-lg mx-auto mt-20 rounded shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-semibold mb-4">Edit Past Class</h2>
        {selectedClass && (
          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditChange}
                required
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                required
                className="w-full border border-gray-300 rounded p-2"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
            >
              Update Class
            </button>
            <button
              type="button"
              onClick={closeEditModal}
              className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default PastClassesList;
