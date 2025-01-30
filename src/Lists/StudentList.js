import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [updateData, setUpdateData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch students from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students: ", error.message);
      }
    };
    fetchStudents();
  }, []);

  // Open modal and set selected student data
  const handleOpenModal = (student) => {
    setSelectedStudent(student);
    setUpdateData(student);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedStudent(null);
    setUpdateData({});
    setIsModalOpen(false);
  };

  // Handle updating student information
  const handleUpdate = async () => {
    try {
      const studentRef = doc(db, "students", selectedStudent.id);
      await updateDoc(studentRef, updateData);
      alert("Student updated successfully!");
      // Update the local state
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === selectedStudent.id ? { ...student, ...updateData } : student
        )
      );
      handleCloseModal();
    } catch (error) {
      alert("Error updating student: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Student List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-4 rounded-lg shadow">
            <img
              src={student.profilePhoto}
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto mb-2"
            />
            <h3 className="text-lg font-bold">{student.name}</h3>
            <p>Class: {student.class}</p>
            <p>Email: {student.email}</p>
            <p>Phone: {student.phone}</p>
            <p>Father's Name: {student.fatherName}</p>
            <p>Mother's Name: {student.motherName}</p>
            <p>Address: {student.address}</p>
            {student.aadharCardLink && (
              <p>
                ID Proof:{" "}
                <a
                  href={student.aadharCardLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Aadhar
                </a>
              </p>
            )}
            <button
              onClick={() => handleOpenModal(student)}
              className="mt-2 bg-blue-500 text-white py-1 px-4 rounded-lg"
            >
              Update Profile
            </button>
          </div>
        ))}
      </div>

      {/* Modal for updating student */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Update Student</h2>
            <div className="mb-4">
              <label className="block font-semibold">Name</label>
              <input
                type="text"
                value={updateData.name}
                onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Class</label>
              <input
                type="text"
                value={updateData.class}
                onChange={(e) => setUpdateData({ ...updateData, class: e.target.value })}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Email</label>
              <input
                type="email"
                value={updateData.email}
                onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Phone</label>
              <input
                type="text"
                value={updateData.phone}
                onChange={(e) => setUpdateData({ ...updateData, phone: e.target.value })}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Father's Name</label>
              <input
                type="text"
                value={updateData.fatherName}
                onChange={(e) =>
                  setUpdateData({ ...updateData, fatherName: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Mother's Name</label>
              <input
                type="text"
                value={updateData.motherName}
                onChange={(e) =>
                  setUpdateData({ ...updateData, motherName: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Address</label>
              <input
                type="text"
                value={updateData.address}
                onChange={(e) => setUpdateData({ ...updateData, address: e.target.value })}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">ID Proof (Aadhar Link)</label>
              <input
                type="text"
                value={updateData.aadharCardLink}
                onChange={(e) =>
                  setUpdateData({ ...updateData, aadharCardLink: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white py-1 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white py-1 px-4 rounded-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
