import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Ensure proper import for Firestore
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const NotesList = () => {
  const [notes, setNotes] = useState([]);

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
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Delete Note
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
