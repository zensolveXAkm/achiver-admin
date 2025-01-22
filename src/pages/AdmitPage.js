import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // For getting passed data and navigation
import { auth, db } from "../firebase"; // Firebase Auth and Firestore
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const AdmitPage = () => {
  const { state } = useLocation(); // Getting the admission details passed from AdmissionListPage
  const navigate = useNavigate();
  const [email, setEmail] = useState(state.email || ""); // Pre-filled email if passed
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.endsWith("@akm.dev")) {
      alert("Email must end with @akm.dev");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "students", user.uid), {
        name: state.name,
        email: email,
        phone: state.phone,
        class: state.class,
        address: state.address,
        profilePhoto: state.profilePhoto,
        fatherName: state.fatherName,
        motherName: state.motherName,
        aadharCardLink: state.aadharCardLink,
      });

      alert("Student admitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Admit Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Name: </label>
          <span>{state.name}</span>
        </div>
        <div className="mb-2">
          <label>Phone: </label>
          <span>{state.phone}</span>
        </div>
        <div className="mb-2">
          <label>Class Enrolling For: </label>
          <span>{state.class}</span>
        </div>
        <div className="mb-2">
          <label>Father's Name: </label>
          <span>{state.fatherName}</span>
        </div>
        <div className="mb-2">
          <label>Mother's Name: </label>
          <span>{state.motherName}</span>
        </div>
        <div className="mb-2">
          <label>Address: </label>
          <span>{state.address}</span>
        </div>
        <div className="mb-2">
          <label>Profile Photo Link: </label>
          <a href={state.profilePhoto} target="_blank" rel="noopener noreferrer">
            View Photo
          </a>
        </div>
        <div className="mb-2">
          <label>Aadhar Card Link: </label>
          <a href={state.aadharCardLink} target="_blank" rel="noopener noreferrer">
            View Aadhar
          </a>
        </div>

        <div className="mt-4">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mt-4">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          {loading ? "Admitting..." : "Admit Student"}
        </button>
      </form>
    </div>
  );
};

export default AdmitPage;
