import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";

const UploadPage = () => {
  const [formData, setFormData] = useState({
    videoLink: "",
    title: "",
    author: "",
    duration: "",
    description: "",
    attachment: null,
    thumbnail: null,
    class: "",
    subject: "", // New field for subject
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to upload files to Cloudinary and return the URL
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "tap-edu");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dkzczonkz/upload`,
        formData
      );
      return response.data.secure_url; // Returning the URL of the uploaded file
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      throw new Error("File upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let attachmentUrl = "";
      let thumbnailUrl = "";

      // Upload files and get URLs if files exist
      if (formData.attachment) {
        attachmentUrl = await handleFileUpload(formData.attachment);
      }

      if (formData.thumbnail) {
        thumbnailUrl = await handleFileUpload(formData.thumbnail);
      }

      // Make sure to update formData with only URLs, not File objects
      const updatedFormData = {
        ...formData,
        attachment: attachmentUrl, // Store the URL of the attachment
        thumbnail: thumbnailUrl,   // Store the URL of the thumbnail
      };

      // Save form data to Firestore
      await addDoc(collection(db, "past_classes"), updatedFormData);

      alert("Course uploaded successfully!");
      setFormData({
        videoLink: "",
        title: "",
        author: "",
        duration: "",
        description: "",
        attachment: null,
        thumbnail: null,
        class: "",
        subject: "", // Reset subject field
      });
    } catch (error) {
      console.error("Error uploading course:", error);
      alert("Failed to upload course.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-xl font-semibold mb-4">Upload Past Classes</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">YouTube Link</label>
          <input
            type="url"
            name="videoLink"
            value={formData.videoLink}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          ></textarea>
        </div>

        {/* Class Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Class</label>
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
            className="border p-2 w-full rounded mb-4"
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
            <option value="COMPETITIVE EXAM">Competitive Exam</option>
            <option value="GENERAL">GENERAL</option>
          </select>
        </div>

        {/* Subject Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Subject</label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="border p-2 w-full rounded mb-4"
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
        </div>

        {/* File Inputs */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Attachment</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) =>
              setFormData({ ...formData, attachment: e.target.files[0] })
            }
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, thumbnail: e.target.files[0] })
            }
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {uploading ? "Uploading..." : "Add Past class"}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;