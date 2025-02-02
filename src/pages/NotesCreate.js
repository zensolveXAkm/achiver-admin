import React, { useState } from "react";
import { db } from "../firebase"; // Ensure proper import for Firestore
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";

const cloudinaryConfig = {
  cloudName: "dkzczonkz",
  uploadPreset: "tap-edu",
};

const classOptions = [
  "VI", "VII", "VIII", "IX", "X", "XI", "XII", "COMPETITIVE EXAM", "GENERAL"
];

const subjectOptions = [
  "Science", "Maths", "Social Science", "Hindi", "English", "Computer"
];

const NotesCreate = () => {
  const [noteData, setNoteData] = useState({
    topic: "",
    subject: "",
    description: "",
    remarks: "",
    class: "",
  });
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    setNoteData({ ...noteData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let attachmentUrl = "";
      if (attachment) {
        const formData = new FormData();
        formData.append("file", attachment);
        formData.append("upload_preset", cloudinaryConfig.uploadPreset);
        formData.append("cloud_name", cloudinaryConfig.cloudName);

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            },
          }
        );
        attachmentUrl = response.data.secure_url;
      }

      await addDoc(collection(db, "notes"), {
        ...noteData,
        attachmentUrl,
        createdAt: new Date(),
      });

      alert("Note added successfully!");
      setNoteData({
        topic: "",
        subject: "",
        description: "",
        remarks: "",
        class: "",
      });
      setAttachment(null);
    } catch (error) {
      alert("Error adding note: " + error.message);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg max-w-lg w-full space-y-6">
        <h2 className="text-2xl font-bold">Create a Note</h2>

        <div>
          <label className="block mb-2">Topic</label>
          <input
            type="text"
            name="topic"
            value={noteData.topic}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Subject</label>
          <select
            name="subject"
            value={noteData.subject}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select a subject</option>
            {subjectOptions.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Class</label>
          <select
            name="class"
            value={noteData.class}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select a class</option>
            {classOptions.map((classOption) => (
              <option key={classOption} value={classOption}>
                {classOption}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Attachment</label>
          <input type="file" onChange={handleFileChange} className="w-full" accept="*/*" />
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={noteData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-2">Remarks</label>
          <input
            type="text"
            name="remarks"
            value={noteData.remarks}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {isSubmitting && (
          <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Note"}
        </button>
      </form>
    </div>
  );
};

export default NotesCreate;
