import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaPlusCircle,
  FaBookOpen,
  FaChalkboardTeacher,
  FaBars,
  FaSignOutAlt,
  FaRegStickyNote,
  FaUserCircle,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BiPhone, BiBug } from "react-icons/bi";
import { getAuth, signOut } from "firebase/auth";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getIconColor = (path) => (location.pathname === path ? "text-blue-700 shadow-lg" : "text-blue-500");
  const getLinkClass = (path) =>
    location.pathname === path
      ? "shadow-md bg-gradient-to-r from-blue-200 to-blue-100 rounded-lg"
      : "hover:bg-blue-50 rounded-lg";

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-blue-100 to-white text-white flex justify-around py-3 shadow-lg">
        <Link to="/homework" className={`flex flex-col items-center ${getIconColor("/homework")}`}>
          <FaBookOpen className="text-2xl" />
          <span className="text-sm">Homework Send</span>
        </Link>
        <Link to="/notes" className={`flex flex-col items-center ${getIconColor("/notes")}`}>
          <FaRegStickyNote className="text-2xl" />
          <span className="text-sm">Notes Create</span>
        </Link>
        <Link to="/create-course" className={`flex flex-col items-center ${getIconColor("/create-course")}`}>
          <FaPlusCircle className="text-2xl" />
          <span className="text-sm">Add Course</span>
        </Link>
        <Link to="/add-quiz" className={`flex flex-col items-center ${getIconColor("/add-quiz")}`}>
          <FaPlusCircle className="text-2xl" />
          <span className="text-sm">Add Quiz</span>
        </Link>
        <Link to="/admissions" className={`flex flex-col items-center ${getIconColor("/admissions")}`}>
          <FaUserCircle className="text-2xl" />
          <span className="text-sm">Admissions</span>
        </Link>
        <Link to="/live" className={`flex flex-col items-center ${getIconColor("/live")}`}>
          <FaChalkboardTeacher className="text-2xl" />
          <span className="text-sm">Start Live</span>
        </Link>
      </nav>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end transition-all duration-500">
          <div className="bg-gradient-to-br from-blue-100 to-white w-3/4 sm:w-1/3 p-5 rounded-l-lg shadow-2xl transform translate-x-0">
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
                Homework Send
              </Link>
              <Link
                to="/notes"
                className={`py-3 px-4 text-lg flex items-center gap-3 ${getLinkClass("/notes")}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FaRegStickyNote className="text-xl" />
                Notes Create
              </Link>
              <Link
                to="/create-course"
                className={`py-3 px-4 text-lg flex items-center gap-3 ${getLinkClass("/create-course")}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FaPlusCircle className="text-xl" />
                Add Course
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
              <button
                onClick={handleLogout}
                className="block w-full text-left py-3 px-4 text-lg text-red-600 items-center gap-3 hover:bg-red-100 rounded-lg"
              >
                <FaSignOutAlt className="text-xl" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
