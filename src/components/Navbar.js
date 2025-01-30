import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaRegStickyNote, FaPlusCircle, FaUpload, FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar"; // Import your Sidebar component

const Navbar = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Highlight active link
  const getIconColor = (path) =>
    location.pathname === path
      ? "text-blue-700 shadow-md font-bold"
      : "text-blue-500 hover:text-blue-700";

  return (
    <>
      {/* Main Content Wrapper */}
      <div className="pb-20"> {/* Adds padding to prevent overlapping */}
        {/* Your page content goes here */}
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-blue-100 to-white flex justify-around py-3 shadow-lg z-50">
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
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col items-center text-blue-500 hover:text-blue-700"
        >
          <FaBars className="text-2xl" />
          <span className="text-sm">More</span>
        </button>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
