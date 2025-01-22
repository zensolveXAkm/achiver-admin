import React, { useState } from "react";
import "./PasswordProtection.css"; // Import custom styles

const PasswordProtection = ({ children }) => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const correctPassword = "akm.dev";

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setAuthenticated(true);
    } else {
      alert("Access Denied! Incorrect Password.");
    }
  };

  if (!authenticated) {
    return (
      <div className="hacker-screen">
        <div className="hacker-box">
          <h2 className="hacker-title glitch" data-text="Enter Password">
            Enter Password
          </h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="hacker-input"
            placeholder="********"
          />
          <button onClick={handlePasswordSubmit} className="hacker-button">
            Access
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default PasswordProtection;
