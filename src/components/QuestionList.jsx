import React from "react";
import { Text } from "@react-three/drei";

const QuestionList = ({ questions, position, visible }) => {
  if (!visible || !questions || questions.length === 0) return null;


  const panelHeight = questions.length * 0.6;

  return (
    <group position={position}>
      {/* Background panel */}
      <mesh>
        <planeGeometry args={[3, panelHeight]} />
        <meshBasicMaterial color="black" opacity={0.85} transparent />
      </mesh>
      {/* Render each question */}
      {questions.map((question, index) => (
        <Text
          key={index}
          position={[0, panelHeight / 2 - (index + 0.5) * 0.6, 0.01]}
          color="white"
          fontSize={0.1}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.005}
          outlineColor="black"
        >
          {question.text}
        </Text>
      ))}
    </group>
  );
};

export default QuestionList;
