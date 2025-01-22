import React, { useEffect, useState } from "react";
import { getFirestore, collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { FaPhone, FaEnvelope, FaTrashAlt, FaEye } from "react-icons/fa";

const db = getFirestore();

const ReceivedMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "messages"), (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });
    return unsubscribe;
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "messages", id));
      alert("Message deleted.");
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Received Messages</h1>
      <ul className="space-y-4">
        {messages.map(({ id, name, email, phone, message, attachmentUrl }) => (
          <li key={id} className="p-4 border rounded shadow">
            <h2 className="font-semibold">{name}</h2>
            <p>{message}</p>
            <div className="flex space-x-3 mt-2">
              <a href={`tel:${phone}`} className="text-blue-500">
                <FaPhone />
              </a>
              <a href={`mailto:${email}`} className="text-green-500">
                <FaEnvelope />
              </a>
              {attachmentUrl && (
                <a href={attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-purple-500">
                  <FaEye />
                </a>
              )}
              <button onClick={() => handleDelete(id)} className="text-red-500">
                <FaTrashAlt />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReceivedMessages;
