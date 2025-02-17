// src/components/ControlPanel.jsx
import React from "react";
import { Text } from "@react-three/drei";

const ControlPanel = ({ onEnergySourceChange, onDeviceChange, toggleNightMode, isNight }) => (
  <group position={[0, 3, -3]}>
    <group position={[-2, 0, 0]}>
      <mesh scale={[1, 0.2, 1]} onPointerDown={() => onEnergySourceChange("bike")}>
        <boxGeometry />
        <meshStandardMaterial color="blue" />
      </mesh>
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Bike
      </Text>
    </group>
    <group position={[0, 0, 0]}>
      <mesh scale={[1, 0.2, 1]} onPointerDown={() => onEnergySourceChange("solar")}>
        <boxGeometry />
        <meshStandardMaterial color="blue" />
      </mesh>
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Solar
      </Text>
    </group>
    {/* <group position={[0, -2, 1]}>
      <mesh scale={[1, 0.2, 1]} onPointerDown={toggleNightMode}>
        <boxGeometry />
        <meshStandardMaterial color={isNight ? "blue" : "yellow"} />
      </mesh>
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {isNight ? "Switch to Day" : "Switch to Night"}
      </Text>
    </group> */}
    <group position={[2, 0, 0]}>
      <mesh scale={[1, 0.2, 1]} onPointerDown={() => onDeviceChange("lamp")}>
        <boxGeometry />
        <meshStandardMaterial color="green" />
      </mesh>
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Lamp
      </Text>
    </group>
    <group position={[4, 0, 0]}>
      <mesh scale={[1, 0.2, 1]} onPointerDown={() => onDeviceChange("fan")}>
        <boxGeometry />
        <meshStandardMaterial color="green" />
      </mesh>
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Fan
      </Text>
    </group>
  </group>
);

export default ControlPanel;
