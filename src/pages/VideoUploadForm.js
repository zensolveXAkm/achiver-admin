import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";

const VideoUploadForm = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const [description, setDescription] = useState("");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = useState("");
  const [classFor, setClassFor] = useState(""); // Added class selection
  const [notesFile, setNotesFile] = useState(null);
  
  const cloudinaryConfig = {
    cloudName: "dkzczonkz",
    apiKey: "588654794854165",
    apiSecret: "cNlUdi7BCOIwqsw6zc9ew-BftnI",
    uploadPreset: "tap-edu",
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);
    
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
      formData
    );
    
    return response.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classFor) {
      alert("Please select a class.");
      return;
    }
    try {
      const thumbnailUrl = thumbnail ? await handleFileUpload(thumbnail) : "";
      const notesUrl = notesFile ? await handleFileUpload(notesFile) : "";

      const videoData = {
        videoLink,
        description,
        remarks,
        date,
        classFor,
        thumbnailUrl,
        notesUrl,
        timestamp: new Date(),
      };

      await addDoc(collection(db, "pastClasses"), videoData);
      alert("Video uploaded successfully!");
      setThumbnail(null);
      setVideoLink("");
      setDescription("");
      setRemarks("");
      setDate("");
      setClassFor("");
      setNotesFile(null);
    } catch (error) {
      alert("Error uploading video: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Upload Past Class Video</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Class</label>
        <select
          value={classFor}
          onChange={(e) => setClassFor(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        >
          <option value="" disabled>
            Select Class uploading For
          </option>
          <option value="VIII">VIII</option>
          <option value="IX">IX</option>
          <option value="X">X</option>
          <option value="XI">XI</option>
          <option value="XII">XII</option>
          <option value="UPSC">UPSC</option>
          <option value="SSC">SSC</option>
          <option value="BANKING">BANKING</option>
          <option value="CLAT">CLAT</option>
          <option value="CAT">CAT</option>
          <option value="MAT">MAT</option>
          <option value="XAT">XAT</option>
          <option value="CUET">CUET</option>
        </select>

        <label className="block mb-2">YouTube Video Link</label>
        <input
          type="url"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          placeholder="Enter YouTube link"
          required
        />

        <label className="block mb-2">Thumbnail (Image)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          className="w-full p-2 mb-4"
        />

        <label className="block mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          placeholder="Enter video description"
          rows="3"
          required
        />

        <label className="block mb-2">Remarks</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          placeholder="Enter remarks"
          rows="2"
        />

        <label className="block mb-2">Class Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        />

        <label className="block mb-2">Additional Notes</label>
        <input
          type="file"
          onChange={(e) => setNotesFile(e.target.files[0])}
          className="w-full p-2 mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Upload Video
        </button>
      </form>
    </div>
  );
};

export default VideoUploadForm;
