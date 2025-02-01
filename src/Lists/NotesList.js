import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Ensure proper import for Firestore
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [updatedNoteData, setUpdatedNoteData] = useState({
    topic: "",
    subject: "",
    description: "",
    remarks: "",
    class: "",
    attachmentUrl: "",
  });

  const classOptions = [
    "VI", "VII", "VIII", "IX", "X", "XI", "XII", "COMPETITIVE EXAM", "GENERAL",
  ];

  const subjectOptions = [
    "Science", "Maths", "Social Science", "Hindi", "English", "Computer",
  ];

  useEffect(() => {
    const fetchNotes = async () => {
      const querySnapshot = await getDocs(collection(db, "notes"));
      const notesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData);
    };
    fetchNotes();
  }, []);

  const handleDeleteNote = async (noteId) => {
    try {
      const noteDocRef = doc(db, "notes", noteId);
      await deleteDoc(noteDocRef);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      alert("Note deleted successfully!");
    } catch (error) {
      alert("Error deleting note: " + error.message);
    }
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setUpdatedNoteData({
      topic: note.topic,
      subject: note.subject,
      description: note.description,
      remarks: note.remarks || "",
      class: note.class,
      attachmentUrl: note.attachmentUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setUpdatedNoteData({ ...updatedNoteData, [e.target.name]: e.target.value });
  };

  const handleUpdateNote = async () => {
    if (editingNote) {
      try {
        const noteDocRef = doc(db, "notes", editingNote.id);
        await updateDoc(noteDocRef, updatedNoteData);

        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === editingNote.id ? { ...note, ...updatedNoteData } : note
          )
        );
        setIsModalOpen(false);
        alert("Note updated successfully!");
      } catch (error) {
        alert("Error updating note: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Notes List</h2>
      {notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-white shadow-lg p-4 rounded-lg">
              <div>
                <h3 className="text-xl font-semibold">{note.topic}</h3>
                <p><strong>Subject:</strong> {note.subject}</p>
                <p><strong>Class:</strong> {note.class}</p>
                <p><strong>Description:</strong> {note.description}</p>
                {note.remarks && <p><strong>Remarks:</strong> {note.remarks}</p>}
                {note.attachmentUrl && (
                  <div>
                    <strong>Attachment:</strong>
                    <a
                      href={note.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Attachment
                    </a>
                  </div>
                )}
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => openEditModal(note)}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Note</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Topic</label>
                <input
                  type="text"
                  name="topic"
                  value={updatedNoteData.topic}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Subject</label>
                <select
                  name="subject"
                  value={updatedNoteData.subject}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select a subject</option>
                  {subjectOptions.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2">Class</label>
                <select
                  name="class"
                  value={updatedNoteData.class}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select a class</option>
                  {classOptions.map((classOption) => (
                    <option key={classOption} value={classOption}>
                      {classOption}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2">Description</label>
                <textarea
                  name="description"
                  value={updatedNoteData.description}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                ></textarea>
              </div>
              <div>
                <label className="block mb-2">Remarks</label>
                <input
                  type="text"
                  name="remarks"
                  value={updatedNoteData.remarks}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateNote}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesList;
