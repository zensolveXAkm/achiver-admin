import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";

const cloudinaryConfig = {
  cloudName: "dkzczonkz",
  uploadPreset: "tap-edu",
};

const classOptions = [
  "VIII", "IX", "X", "XI", "XII", "UPSC", "SSC", "BANKING", "CLAT", "CAT", "MAT", "XAT", "CUET"
];

const CreateCourse = () => {
  const [courseData, setCourseData] = useState({
    topic: "",
    description: "",
    price: "",
    courseLink: "",
    author: "",
    duration: "",
    bestFor: "",
    classEnrollingFor: "",
  });
  const [isFree, setIsFree] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleFileChange = (e) => setThumbnail(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let thumbnailUrl = "";
      if (thumbnail) {
        const formData = new FormData();
        formData.append("file", thumbnail);
        formData.append("upload_preset", cloudinaryConfig.uploadPreset);
        formData.append("cloud_name", cloudinaryConfig.cloudName);
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
          formData
        );
        thumbnailUrl = response.data.secure_url;
      }

      await addDoc(collection(db, "courses"), {
        ...courseData,
        price: isFree ? "Free" : courseData.price,
        thumbnailUrl,
        createdAt: new Date(),
      });

      alert("Course created successfully!");
      setCourseData({
        topic: "",
        description: "",
        price: "",
        courseLink: "",
        author: "",
        duration: "",
        bestFor: "",
        classEnrollingFor: "",
      });
      setThumbnail(null);
      setIsFree(false);
    } catch (error) {
      alert("Error creating course: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 p-8">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-2xl rounded-lg max-w-xl w-full space-y-6">
        <h2 className="text-3xl font-semibold text-center text-blue-600">Create a Course</h2>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Thumbnail</label>
          <input type="file" onChange={handleFileChange} className="w-full border rounded px-4 py-2" accept="image/*" required />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Topic</label>
          <input type="text" name="topic" value={courseData.topic} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" value={courseData.description} onChange={handleChange} className="w-full border rounded px-4 py-2" required></textarea>
        </div>
        
        <div className="flex items-center space-x-2">
          <input type="checkbox" checked={isFree} onChange={() => setIsFree(!isFree)} className="h-5 w-5 text-blue-600" />
          <label className="text-sm font-medium">This course is free for everyone</label>
        </div>
        
        {!isFree && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Price</label>
            <input type="number" name="price" value={courseData.price} onChange={handleChange} className="w-full border rounded px-4 py-2" />
          </div>
        )}
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Course Link</label>
          <input type="text" name="courseLink" value={courseData.courseLink} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Author</label>
          <input type="text" name="author" value={courseData.author} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Duration</label>
          <input type="text" name="duration" value={courseData.duration} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Best For</label>
          <input type="text" name="bestFor" value={courseData.bestFor} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Class Enrolling For</label>
          <select
            name="classEnrollingFor"
            value={courseData.classEnrollingFor}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          >
            <option value="">Select Class</option>
            {classOptions.map((classOption) => (
              <option key={classOption} value={classOption}>
                {classOption}
              </option>
            ))}
          </select>
        </div>
        
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Submit Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
