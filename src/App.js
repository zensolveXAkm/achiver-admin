import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import CreateCourse from "./pages/CreateCourse";
import AdmissionListPage from "./pages/AddmissionListPage";
import HomeworkSend from "./pages/HomeworkSend";
import NotesCreate from "./pages/NotesCreate";
import AddQuizPage from "./pages/AddQuizPage";
import AddClassPage from "./pages/AddClassPage";
import HomeworkTreeView from "./pages/SubmittedHomeworkList";
import AdmitPage from "./pages/AdmitPage";
import VideoUploadForm from "./pages/VideoUploadForm";
import PasswordProtection from "./pages/PasswordProtection"; // Import the new component

const App = () => {
  return (
    <PasswordProtection>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/homework" element={<HomeworkSend />} />
            <Route path="/notes" element={<NotesCreate />} />
            <Route path="/create-course" element={<CreateCourse />} />
            <Route path="/add-quiz" element={<AddQuizPage />} />
            <Route path="/admissions" element={<AdmissionListPage />} />
            <Route path="/live" element={<AddClassPage />} />
            <Route path="/" element={<HomeworkTreeView />} />
            <Route path="/admit" element={<AdmitPage />} />
            <Route path="/upload" element={<VideoUploadForm />} />
          </Routes>
          <Navbar />
        </div>
      </Router>
    </PasswordProtection>
  );
};

export default App;
