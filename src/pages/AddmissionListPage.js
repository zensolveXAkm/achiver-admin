import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";

const AdmissionListPage = () => {
  const [admissions, setAdmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "admissions"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAdmissions(data);
      } catch (error) {
        alert("Error fetching admissions: " + error.message);
      }
    };
    fetchAdmissions();
  }, []);

  const handleReject = async (admissionId) => {
    const confirmed = window.confirm("Are you sure you want to reject?");
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "admissions", admissionId));
        setAdmissions(admissions.filter((admission) => admission.id !== admissionId));
        alert("Rejected successfully!");
      } catch (error) {
        alert("Error rejecting admission: " + error.message);
      }
    }
  };

  const handleAdmit = (admission) => {
    navigate("/admit", { state: admission });
  };

  const handleCompleted = async (admission) => {
    try {
      await addDoc(collection(db, "completedAdmissions"), admission);
      alert("Marked as completed!");
      setAdmissions(admissions.filter((ad) => ad.id !== admission.id));
    } catch (error) {
      alert("Error marking completed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Admission List</h2>
      {admissions.length > 0 ? (
        <table className="w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2">Photo</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Class</th>
              <th className="p-2">Address</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admissions.map((admission) => (
              <tr key={admission.id} className="border-b">
                <td className="p-2">
                  <img
                    src={admission.profilePhoto}
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="p-2">{admission.name}</td>
                <td className="p-2">{admission.email}</td>
                <td className="p-2">{admission.phone}</td>
                <td className="p-2">{admission.class}</td>
                <td className="p-2">{admission.address}</td>
                <td className="p-2">
                  <button
                    onClick={() => window.location.href = `tel:${admission.phone}`}
                    className="bg-green-500 text-white py-1 px-4 rounded-lg"
                  >
                    Call
                  </button>
                  <button
                    onClick={() => handleAdmit(admission)}
                    className="bg-blue-500 text-white py-1 px-4 rounded-lg mx-2"
                  >
                    Admit
                  </button>
                  <button
                    onClick={() => handleCompleted(admission)}
                    className="bg-gray-500 text-white py-1 px-4 rounded-lg"
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => handleReject(admission.id)}
                    className="bg-red-500 text-white py-1 px-4 rounded-lg"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No admissions found.</p>
      )}
    </div>
  );
};

export default AdmissionListPage;
