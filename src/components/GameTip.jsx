import React from "react";
import { Html } from "@react-three/drei";

const GameTip = ({ tip, position, visible }) => {
  if (!visible) return null;
  return (
    <Html position={position} center>
      <div style={{
        background: "rgba(0, 0, 0, 0.85)",
        padding: "20px",               // increased padding for more space
        borderRadius: "10px",
        color: "white",
        fontSize: "24px",              // larger text
        fontWeight: "bold",
        textAlign: "center",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
        minWidth: "300px",             // ensures a minimum width
        whiteSpace: "pre-wrap",        // allows wrapping of text
      }}>
        {tip}
      </div>
    </Html>
  );
};

export default GameTip;
