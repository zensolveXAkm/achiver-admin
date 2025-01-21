import React, { useState } from "react";
import { db } from "../firebase"; // Firestore database import
import { collection, addDoc } from "firebase/firestore";
import axios from "axios"; // Import axios

const HomeworkSend = () => {
  const [homeworkData, setHomeworkData] = useState({
    topic: "",
    description: "",
    remarks: "",
    homeworkDate: "",
    dueDate: "",
    class: "7th",
  });
  const [attachment, setAttachment] = useState(null);

  const handleChange = (e) => {
    setHomeworkData({ ...homeworkData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "uday-oc"); // Use provided upload preset

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dqubwzm17/upload`;
    const response = await axios.post(cloudinaryUrl, formData);
    return response.data.secure_url; // Get the secure URL of uploaded file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let attachmentUrl = "";
      if (attachment) {
        attachmentUrl = await uploadToCloudinary(attachment); // Upload to Cloudinary
      }

      await addDoc(collection(db, "homework"), {
        ...homeworkData,
        attachmentUrl,
        createdAt: new Date(),
      });

      alert("Homework sent successfully!");
      setHomeworkData({
        topic: "",
        description: "",
        remarks: "",
        homeworkDate: "",
        dueDate: "",
        class: "7th",
      });
      setAttachment(null);
    } catch (error) {
      alert("Error sending homework: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg max-w-lg w-full space-y-6">
        <h2 className="text-2xl font-bold">Send Homework</h2>
        <input type="text" name="topic" value={homeworkData.topic} onChange={handleChange} placeholder="Topic" required className="w-full p-2 border rounded" />
        <textarea name="description" value={homeworkData.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 border rounded"></textarea>
        <input type="file" onChange={handleFileChange} className="w-full" accept="*/*" required />
        <input type="text" name="remarks" value={homeworkData.remarks} onChange={handleChange} placeholder="Remarks" className="w-full p-2 border rounded" />
        <input type="date" name="homeworkDate" value={homeworkData.homeworkDate} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="date" name="dueDate" value={homeworkData.dueDate} onChange={handleChange} required className="w-full p-2 border rounded" />
        <select name="class" value={homeworkData.class} onChange={handleChange} className="w-full p-2 border rounded">
          {[...Array(6)].map((_, i) => (
            <option key={i + 7}>{i + 7}th</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">Send Homework</button>
      </form>
    </div>
  );
};

export default HomeworkSend;
