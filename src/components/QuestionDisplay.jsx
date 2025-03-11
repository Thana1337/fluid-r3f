// src/components/QuestionDisplay.jsx
import React from "react";
import { Text } from "@react-three/drei";

const QuestionDisplay = ({ question, position, visible, onAnswer }) => {
  if (!visible || !question) return null;

  const panelWidth = 3;
  const panelHeight = 1.5;

  return (
    <group position={position}>
      {/* Background panel */}
      <mesh>
        <planeGeometry args={[panelWidth, panelHeight]} />
        <meshBasicMaterial color="black" opacity={0.85} transparent />
      </mesh>
      {/* Question text */}
      <Text
        position={[0, panelHeight / 2 - 0.3, 0.01]}
        color="white"
        fontSize={0.15}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="black"
      >
        {question.text}
      </Text>
      {/* Render options as clickable elements */}
      {question.options.map((option, index) => (
        <mesh
          key={option.id || `option-${index}`}
          position={[0, panelHeight / 2 - 0.8 - index * 0.3, 0.02]}
          onClick={() => onAnswer(option)}
        >
          <planeGeometry args={[2.5, 0.25]} />
          <meshBasicMaterial color="grey" opacity={0.9} transparent />
          <Text
            position={[0, 0, 0.01]}
            color="white"
            fontSize={0.1}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.005}
            outlineColor="black"
          >
            {option.text}
          </Text>
        </mesh>
      ))}
    </group>
  );
};

export default QuestionDisplay;
