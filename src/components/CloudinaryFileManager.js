import React, { useEffect, useState } from "react";
import axios from "axios";

const CloudinaryFileManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Configuration
  const cloudName = "dkzczonkz";
  const uploadPreset = "tap-edu";

  // Fetch files using a secure Cloudinary search endpoint
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
        {
          expression: "resource_type:image",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFiles(response.data.resources || []);
    } catch (err) {
      setError("Failed to fetch files: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cloudinary File Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <div key={file.public_id} className="bg-white p-4 shadow-lg rounded-lg">
            <img
              src={file.secure_url}
              alt={file.public_id}
              className="w-full h-40 object-cover rounded-lg"
            />
            <p className="mt-2 text-sm text-gray-600">{file.public_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CloudinaryFileManager;
