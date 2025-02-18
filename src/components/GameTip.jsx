import React from "react";
import { Html } from "@react-three/drei";

const GameTip = ({ tip, position, visible }) => {
  if (!visible) return null;
  return (
    <Html position={position} center>
      <div style={{
        background: "rgba(0, 0, 0, 0.85)",
        padding: "5px",               
        borderRadius: "10px",
        color: "white",
        fontSize: "14px",             
        fontWeight: "bold",
        textAlign: "center",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
        minWidth: "150px",           
        whiteSpace: "pre-wrap",      
      }}>
        {tip}
      </div>
    </Html>
  );
};

export default GameTip;
