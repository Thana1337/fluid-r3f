// src/components/NameTag.jsx
import React from "react";
import { Text, Billboard } from "@react-three/drei";

const NameTag = ({ username, offset = [0, 1, 0] }) => {
  return (
    <group position={offset}>
      <Billboard>
        <Text
          fontSize={0.07}
          color="white"
          anchorX="center"
          anchorY="middle"
          material-depthTest={false}
          outlineWidth={0.08}
          outlineColor="black"
        >
          {username}
        </Text>
      </Billboard>
    </group>
  );
};

export default NameTag;
