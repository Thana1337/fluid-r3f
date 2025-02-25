import React from "react";
import { Text } from "@react-three/drei";

const GameTip = ({ tip, position, visible }) => {
  if (!visible) return null;
  return (
    <group position={position}>
      {/* Background plane */}
      <mesh>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial color="black" opacity={0.85} transparent />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        color="white"
        fontSize={0.1}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="black"
      >
        {tip}
      </Text>
    </group>
  );
};

export default GameTip;
