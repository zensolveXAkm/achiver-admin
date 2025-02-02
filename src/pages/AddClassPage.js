import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const AddClassPage = () => {
  const [formData, setFormData] = useState({
    topic: "",
    class: "",
    subject: "", // New field for subject
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    link: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const uploadThumbnail = async () => {
    const formData = new FormData();
    formData.append("file", thumbnail);
    formData.append("upload_preset", "tap-edu");
    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dkzczonkz/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      throw new Error("Failed to upload thumbnail: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const thumbnailUrl = await uploadThumbnail();
      const classData = {
        ...formData,
        thumbnail: thumbnailUrl,
        startDateTime: `${formData.startDate}T${formData.startTime}`,
        endDateTime: `${formData.endDate}T${formData.endTime}`,
      };
      delete classData.startDate; // Remove redundant fields
      delete classData.startTime;
      delete classData.endDate;
      delete classData.endTime;

      await addDoc(collection(db, "liveClasses"), classData);
      alert("Class added successfully!");
      setFormData({
        topic: "",
        class: "",
        subject: "", // Reset subject field
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        link: "",
      });
      setThumbnail(null);
    } catch (error) {
      alert("Error adding class: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Add Live Class</h2>
        <label className="block mb-2 font-semibold">Class Topic</label>
        <input
          type="text"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <label className="block mt-4 mb-2 font-semibold">Select Class</label>
        <select
          name="class"
          value={formData.class}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Select a class</option>
          <option value="VI">VI</option>
          <option value="VII">VII</option>
          <option value="VIII">VIII</option>
          <option value="IX">IX</option>
          <option value="X">X</option>
          <option value="XI">XI</option>
          <option value="XII">XII</option>
          <option value="Competitive Exam">Competitive Exam</option>
          <option value="GENERAL">GENERAL</option>
          
        </select>

        {/* New Subject Dropdown */}
        <label className="block mt-4 mb-2 font-semibold">Select Subject</label>
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Select a subject</option>
          <option value="Science">Science</option>
          <option value="Maths">Maths</option>
          <option value="Social Science">Social Science</option>
          <option value="Hindi">Hindi</option>
          <option value="English">English</option>
          <option value="Computer">Computer</option>
        </select>

        <label className="block mt-4 mb-2 font-semibold">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <label className="block mt-4 mb-2 font-semibold">Start Time</label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <label className="block mt-4 mb-2 font-semibold">End Date</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <label className="block mt-4 mb-2 font-semibold">End Time</label>
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <label className="block mt-4 mb-2 font-semibold">Class Link</label>
        <input
          type="url"
          name="link"
          value={formData.link}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <label className="block mt-4 mb-2 font-semibold">Upload Thumbnail</label>
        <input
          type="file"
          onChange={handleThumbnailChange}
          accept="image/*"
          className="border p-2 w-full rounded"
          required
        />

        <button
          type="submit"
          className={`mt-6 bg-blue-600 text-white p-2 w-full rounded ${
            uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Add Class"}
        </button>
      </form>
    </div>
  );
};

export default AddClassPage;