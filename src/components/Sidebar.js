import React from "react";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaPlusCircle,
  FaUserCircle,
  FaChalkboardTeacher,
  FaUpload,
  FaListAlt,
  FaClipboardList,
  FaUsers,
  FaFileAlt,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const Sidebar = ({ closeSidebar }) => {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="bg-black bg-opacity-50 flex-1 cursor-pointer"
        onClick={closeSidebar}
      ></div>

      {/* Sidebar Content */}
      <div
        className="w-3/4 sm:w-1/3 bg-gradient-to-br from-blue-100 to-white p-5 rounded-l-lg shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0 animate-slide-in"
      >
        <button
          onClick={closeSidebar}
          className="text-gray-800 mb-4 transition-transform duration-200 hover:scale-110"
        >
          <IoMdClose className="text-2xl" />
        </button>

        <nav className="space-y-4 overflow-y-auto max-h-[80vh]">
          {/* Sidebar Navigation Links */}
          {[
            { to: "/homework", label: "Homework", icon: <FaBookOpen /> },
            { to: "/add-quiz", label: "Add Quiz", icon: <FaPlusCircle /> },
            { to: "/admissions", label: "Admissions", icon: <FaUserCircle /> },
            { to: "/live", label: "Start Live", icon: <FaChalkboardTeacher /> },
            { to: "/add-past-class", label: "Add Past Class", icon: <FaUpload /> },
            { to: "/classlist", label: "Class List", icon: <FaListAlt /> },
            { to: "/admittedlist", label: "Admitted Students", icon: <FaClipboardList /> },
            { to: "/studentlist", label: "Student List", icon: <FaUsers /> },
            { to: "/quizlist", label: "Quiz List", icon: <FaListAlt /> },
            { to: "/courseslist", label: "Courses List", icon: <FaBookOpen /> },
            { to: "/notelist", label: "Notes List", icon: <FaFileAlt /> },
            { to: "/Pastlist", label: "Past Classes List", icon: <FaClipboardList /> },
          ].map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="py-3 px-4 text-lg flex items-center gap-3 hover:bg-blue-50 rounded-lg"
              onClick={closeSidebar}
            >
              <span className="text-xl">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <style>
        {`
          @keyframes slide-in {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(0);
            }
          }
          @keyframes slide-out {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .animate-slide-in {
            animation: slide-in 0.3s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Sidebar;
