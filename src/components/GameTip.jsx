import React from "react";
import { Text, Billboard } from "@react-three/drei";

const GameTip = React.memo(({ tip, position, visible }) => {
  if (!visible) return null;
  return (
    <Billboard position={position}>
      <group>
        {/* <mesh>
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial color="black" opacity={0.8} transparent />
        </mesh> */}
        <Text
          position={[0, 0, 0.01]}
          color="white"
          fontSize={0.1}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.15}
          outlineColor="black"
        >
          {tip}
        </Text>
      </group>
    </Billboard>
  );
});

export default GameTip;
