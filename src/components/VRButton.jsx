// src/components/VRButton.jsx
import React, { useState, useEffect, useRef } from "react";
import { Filter } from "bad-words";

const filter = new Filter();

const VRButton = ({ onEnterVR }) => {
  const [error, setError] = useState("");

  // Create a ref for AudioContext
  const audioContextRef = useRef(null);

  // On mount, create the AudioContext and check for stored username
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // Handler to resume AudioContext then enter VR
  const handleEnterVR = async () => {
    if (audioContextRef.current && audioContextRef.current.state !== "running") {
      try {
        await audioContextRef.current.resume();
        console.log("AudioContext resumed");
      } catch (err) {
        console.error("Failed to resume AudioContext", err);
      }
    }
    onEnterVR();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        fontFamily: "'Roboto', sans-serif",
      }}
    >
        <button
          onClick={handleEnterVR}
          style={{
            padding: "1rem 2rem",
            fontSize: "1.5rem",
            backgroundColor: "#FFC300",
            border: "none",
            borderRadius: "8px",
            color: "black",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          Enter VR
        </button>
    </div>
  );
};

export default VRButton;
