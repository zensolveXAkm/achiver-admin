import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreateCourse from "./pages/CreateCourse";
import AdmissionListPage from "./pages/AddmissionListPage";
import HomeworkSend from "./pages/HomeworkSend";
import NotesCreate from "./pages/NotesCreate";
// import AddQuizPage from "./pages/AddQuizPage";
import BulkQuizForm from "./pages/QuizPage";
import AddClassPage from "./pages/AddClassPage";
import HomeworkTreeView from "./Lists/SubmittedHomeworkList";
import AdmitPage from "./pages/AdmitPage";
import PasswordProtection from "./components/PasswordProtection"; // Import the new component
import UploadPage from "./pages/UploadPage"; // Import the new component
import ClassList from "./Lists/ClassList";
import AdmittedStudents from "./Lists/AdmittedStudents";
import StudentList from "./Lists/StudentList";
import QuizListPage from "./Lists/QuizListPage";
import CoursesList from "./Lists/CoursesList";
import NotesList from "./Lists/NotesList";
import PastClassesList from "./Lists/PastClassesList";
import Error10 from "./components/404";
import CloudinaryFileManager from "./components/CloudinaryFileManager";
const App = () => {
  return (
    <PasswordProtection>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/files" element={<CloudinaryFileManager/>}/>
            <Route path="/homework" element={<HomeworkSend />} />
            <Route path="/notes" element={<NotesCreate />} />
            <Route path="/create-course" element={<CreateCourse />} />
            <Route path="/add-quiz" element={<BulkQuizForm />} />
            <Route path="/admissions" element={<AdmissionListPage />} />
            <Route path="/live" element={<AddClassPage />} />
            <Route path="/" element={<HomeworkTreeView />} />
            <Route path="/admit" element={<AdmitPage />} />
            <Route path="/add-past-class" element={<UploadPage/>}/>
            <Route paht="*" element={<Error10/>}/>
            <Route path="/classlist" element={<ClassList/>}/>
            <Route path="/admittedlist" element={<AdmittedStudents/>}/>
            <Route path="/studentlist" element={<StudentList/>}/>
            <Route path="/quizlist" element={<QuizListPage/>}/>
            <Route path="/courseslist" element={<CoursesList/>}/>
            <Route path="/notelist" element={<NotesList/>}/>
            <Route path="/Pastlist" element={<PastClassesList/>}/>
            <Route path="*" element={<Error10/>}/>
          </Routes>
        </div>
          <Navbar />
      </Router>
    </PasswordProtection>
  );
};

export default App;
