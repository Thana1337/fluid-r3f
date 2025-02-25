import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// A single key component.
const VirtualKey = ({ label, onKeyPress, position }) => {
  return (
    <group position={position} onClick={() => onKeyPress(label)}>
      <mesh>
        <planeGeometry args={[0.15, 0.15]} />
        <meshBasicMaterial color={new THREE.Color('gray')} />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.07}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};

const VirtualKeyboard = ({ onKeyPress, onBackspace, onEnter, position = [0, 0, 0] }) => {
  // Define three rows of keys
  const row1 = ['Q','W','E','R','T','Y','U','I','O','P'];
  const row2 = ['A','S','D','F','G','H','J','K','L'];
  const row3 = ['Z','X','C','V','B','N','M'];
  
  // Helper function to render a row
  const renderRow = (keys, yOffset) =>
    keys.map((key, i) => {
      // Center the row by offsetting based on the row length.
      const rowLength = keys.length;
      const xPos = i * 0.17 - (rowLength * 0.17) / 2;
      return (
        <VirtualKey 
          key={key}
          label={key}
          position={[xPos, yOffset, 0]}
          onKeyPress={onKeyPress}
        />
      );
    });
    
  return (
    <group position={position}>
      {/* First row */}
      <group position={[0, 0.1, 0]}>
        {renderRow(row1, 0)}
      </group>
      {/* Second row */}
      <group position={[0, -0.05, 0]}>
        {renderRow(row2, 0)}
      </group>
      {/* Third row with additional command keys */}
      <group position={[0, -0.2, 0]}>
        {renderRow(row3, 0)}
        <VirtualKey 
          label="Back" 
          onKeyPress={onBackspace} 
          position={[-0.4, -0.3, 0]} 
        />
        <VirtualKey 
          label="Enter" 
          onKeyPress={onEnter} 
          position={[0.4, -0.3, 0]} 
        />
      </group>
    </group>
  );
};

export default VirtualKeyboard;
