import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";

const cloudinaryConfig = {
  cloudName: "dqubwzm17",
  uploadPreset: "uday-oc",
};

const CreateCourse = () => {
  const [courseData, setCourseData] = useState({
    topic: "",
    description: "",
    price: "",
    courseLink: "",
    author: "",
    duration: "",
    bestFor: "",
    categories: [],
  });
  const [isFree, setIsFree] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);

  const categoryOptions = [
    "Science Students", "Commerce Students", "Class 1", "Class 2", "Class 3", 
    "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", 
    "Class 10", "Class 11", "Class 12", "More"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleCheckboxChange = (category) => {
    setCourseData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((cat) => cat !== category)
        : [...prev.categories, category],
    }));
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
        categories: [],
      });
      setThumbnail(null);
      setIsFree(false);
    } catch (error) {
      alert("Error creating course: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg max-w-lg w-full space-y-6">
        <h2 className="text-2xl font-bold">Create a Course</h2>
        <div>
          <label>Thumbnail</label>
          <input type="file" onChange={handleFileChange} className="w-full" accept="image/*" required />
        </div>
        <div>
          <label>Topic</label>
          <input type="text" name="topic" value={courseData.topic} onChange={handleChange} className="w-full" required />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={courseData.description} onChange={handleChange} className="w-full" required></textarea>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={isFree} onChange={() => setIsFree(!isFree)} />
            This course is free for everyone
          </label>
        </div>
        {!isFree && (
          <div>
            <label>Price</label>
            <input type="number" name="price" value={courseData.price} onChange={handleChange} className="w-full" />
          </div>
        )}
        <div>
          <label>Course Link</label>
          <input type="text" name="courseLink" value={courseData.courseLink} onChange={handleChange} className="w-full" required />
        </div>
        <div>
          <label>Author</label>
          <input type="text" name="author" value={courseData.author} onChange={handleChange} className="w-full" required />
        </div>
        <div>
          <label>Duration</label>
          <input type="text" name="duration" value={courseData.duration} onChange={handleChange} className="w-full" required />
        </div>
        <div>
          <label>Best For</label>
          <input type="text" name="bestFor" value={courseData.bestFor} onChange={handleChange} className="w-full" required />
        </div>
        <div>
          <label>Categories</label>
          {categoryOptions.map((category) => (
            <label key={category} className="block">
              <input
                type="checkbox"
                checked={courseData.categories.includes(category)}
                onChange={() => handleCheckboxChange(category)}
              />
              {category}
            </label>
          ))}
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700">
          Submit Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
