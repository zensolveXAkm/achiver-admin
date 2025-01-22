import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBookOpen,
  FaRegStickyNote,
  FaPlusCircle,
  FaUserCircle,
  FaChalkboardTeacher,
  FaBars,
  FaUpload,
  FaHome,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getIconColor = (path) => (location.pathname === path ? "text-blue-700 shadow-lg" : "text-blue-500");
  const getLinkClass = (path) =>
    location.pathname === path
      ? "shadow-md bg-gradient-to-r from-blue-200 to-blue-100 rounded-lg"
      : "hover:bg-blue-50 rounded-lg";

  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-blue-100 to-white flex justify-around py-3 shadow-lg">
        <Link to="/" className={`flex flex-col items-center ${getIconColor("/")}`}>
          <FaHome className="text-2xl" />
          <span className="text-sm">Homeworks</span>
        </Link>
        <Link to="/notes" className={`flex flex-col items-center ${getIconColor("/notes")}`}>
          <FaRegStickyNote className="text-2xl" />
          <span className="text-sm">Notes</span>
        </Link>
        <Link to="/create-course" className={`flex flex-col items-center ${getIconColor("/create-course")}`}>
          <FaPlusCircle className="text-2xl" />
          <span className="text-sm">Add Course</span>
        </Link>
        <Link to="/upload" className={`flex flex-col items-center ${getIconColor("/upload")}`}>
          <FaUpload className="text-2xl" />
          <span className="text-sm">Upload</span>
        </Link>
        <button onClick={() => setSidebarOpen(true)} className="flex flex-col items-center text-blue-500">
          <FaBars className="text-2xl" />
          <span className="text-sm">More</span>
        </button>
      </nav>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end transition-all duration-500">
          <div className="bg-gradient-to-br from-blue-100 to-white w-3/4 sm:w-1/3 p-5 rounded-l-lg shadow-2xl">
            <button onClick={() => setSidebarOpen(false)} className="text-gray-800 mb-4">
              <IoMdClose className="text-2xl" />
            </button>
            <nav className="space-y-3">
              <Link
                to="/homework"
                className={`py-3 px-4 text-lg flex items-center gap-3 ${getLinkClass("/homework")}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FaBookOpen className="text-xl" />
                Homework
              </Link>
              <Link
                to="/add-quiz"
                className={`py-3 px-4 text-lg flex items-center gap-3 ${getLinkClass("/add-quiz")}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FaPlusCircle className="text-xl" />
                Add Quiz
              </Link>
              <Link
                to="/admissions"
                className={`py-3 px-4 text-lg flex items-center gap-3 ${getLinkClass("/admissions")}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FaUserCircle className="text-xl" />
                Admissions
              </Link>
              <Link
                to="/live"
                className={`py-3 px-4 text-lg flex items-center gap-3 ${getLinkClass("/live")}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FaChalkboardTeacher className="text-xl" />
                Start Live
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
