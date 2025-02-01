import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const classOptions = [
  "VIII", "IX", "X", "XI", "XII", "COMPETITIVE EXAM", "GENERAL"
];

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const courseList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(courseList);
        setLoading(false);
      } catch (error) {
        alert("Error fetching courses: " + error.message);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.topic && course.topic.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass ? course.classEnrollingFor === selectedClass : true;
    return matchesSearch && matchesClass;
  });

  const handleDelete = async (courseId) => {
    try {
      // Handle the delete operation here
      // Example: await deleteDoc(doc(db, "courses", courseId));

      // Re-fetch courses after deletion
      alert("Course deleted successfully!");
    } catch (error) {
      alert("Error deleting course: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by topic"
          className="w-1/3 p-2 border rounded"
        />
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Class</option>
          {classOptions.map((classOption) => (
            <option key={classOption} value={classOption}>
              {classOption}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center text-xl text-blue-500">Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold">{course.topic}</h3>
                <p className="text-sm text-gray-600">{course.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-700">{course.classEnrollingFor}</span>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-lg text-gray-500">No courses found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursesList;
