import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation to Admit page
import { db } from "../firebase"; // Import Firestore setup
import { collection, getDocs } from "firebase/firestore";

const AdmissionListPage = () => {
  const [admissions, setAdmissions] = useState([]);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "admissions"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAdmissions(data);
      } catch (error) {
        alert("Error fetching admissions: " + error.message);
      }
    };
    fetchAdmissions();
  }, []);

  const handleAdmit = (admission) => {
    navigate("/admit", { state: admission });
  };

  const handleReject = (admission) => {
    alert(`Rejected: ${admission.name}`);
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
              <th className="p-2">Father's Name</th>
              <th className="p-2">Mother's Name</th>
              <th className="p-2">Aadhar Card</th>
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
                <td className="p-2">{admission.fatherName}</td>
                <td className="p-2">{admission.motherName}</td>
                <td className="p-2">
                  <a
                    href={admission.aadharCardLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View
                  </a>
                </td>
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
                    onClick={() => handleReject(admission)}
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
