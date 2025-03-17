// src/components/SetUsername.jsx
import React, { useState } from "react";
import { Filter } from "bad-words";

const filter = new Filter();

const SetUsername = ({ onUsernameSet }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSetUsername = () => {
    const trimmedName = username.trim();
    if (!trimmedName) {
      setError("Username cannot be empty.");
      return;
    }
    if (filter.isProfane(trimmedName)) {
      setError("Username contains inappropriate language. Please choose a different name.");
      return;
    }
    localStorage.setItem("username", trimmedName);
    onUsernameSet(trimmedName);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#222",
        color: "#fff",
      }}
    >
      <h2>Enter Your Username</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setError("");
        }}
        placeholder="Username..."
        style={{
          padding: "0.75rem",
          fontSize: "1rem",
          marginBottom: "1rem",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      />
      {error && <span style={{ color: "red", marginBottom: "1rem" }}>{error}</span>}
      <button
        onClick={handleSetUsername}
        style={{
          padding: "0.75rem 2rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#FFC300",
          cursor: "pointer",
        }}
      >
        Set Username
      </button>
    </div>
  );
};

export default SetUsername;
