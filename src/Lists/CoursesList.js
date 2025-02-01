import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const classOptions = [
  "VI", "VII", "VIII", "IX", "X", "XI", "XII", "COMPETITIVE EXAM", "GENERAL"
];

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [updatedTopic, setUpdatedTopic] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedClass, setUpdatedClass] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [updatedCourseLink, setUpdatedCourseLink] = useState("");
  const [updatedAuthor, setUpdatedAuthor] = useState("");
  const [updatedDuration, setUpdatedDuration] = useState("");
  const [updatedBestFor, setUpdatedBestFor] = useState("");
  const [updatedSubject, setUpdatedSubject] = useState("");

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

  const handleEdit = (course) => {
    setEditingCourse(course);
    setUpdatedTopic(course.topic);
    setUpdatedDescription(course.description);
    setUpdatedClass(course.classEnrollingFor);
    setUpdatedPrice(course.price);
    setUpdatedCourseLink(course.courseLink);
    setUpdatedAuthor(course.author);
    setUpdatedDuration(course.duration);
    setUpdatedBestFor(course.bestFor);
    setUpdatedSubject(course.subject);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (editingCourse) {
      try {
        const courseRef = doc(db, "courses", editingCourse.id);
        await updateDoc(courseRef, {
          topic: updatedTopic,
          description: updatedDescription,
          classEnrollingFor: updatedClass,
          price: updatedPrice,
          courseLink: updatedCourseLink,
          author: updatedAuthor,
          duration: updatedDuration,
          bestFor: updatedBestFor,
          subject: updatedSubject,
        });
        alert("Course updated successfully!");
        setIsModalOpen(false);
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === editingCourse.id
              ? {
                  ...course,
                  topic: updatedTopic,
                  description: updatedDescription,
                  classEnrollingFor: updatedClass,
                  price: updatedPrice,
                  courseLink: updatedCourseLink,
                  author: updatedAuthor,
                  duration: updatedDuration,
                  bestFor: updatedBestFor,
                  subject: updatedSubject,
                }
              : course
          )
        );
      } catch (error) {
        alert("Error updating course: " + error.message);
      }
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
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-lg text-gray-500">No courses found</div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Course</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium">Topic</label>
              <input
                type="text"
                value={updatedTopic}
                onChange={(e) => setUpdatedTopic(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                value={updatedPrice}
                onChange={(e) => setUpdatedPrice(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Course Link</label>
              <input
                type="text"
                value={updatedCourseLink}
                onChange={(e) => setUpdatedCourseLink(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Author</label>
              <input
                type="text"
                value={updatedAuthor}
                onChange={(e) => setUpdatedAuthor(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Duration</label>
              <input
                type="text"
                value={updatedDuration}
                onChange={(e) => setUpdatedDuration(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Best For</label>
              <input
                type="text"
                value={updatedBestFor}
                onChange={(e) => setUpdatedBestFor(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Subject</label>
              <input
                type="text"
                value={updatedSubject}
                onChange={(e) => setUpdatedSubject(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
