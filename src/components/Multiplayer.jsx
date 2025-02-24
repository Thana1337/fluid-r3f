// Multiplayer.jsx
import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import useMultiplayer from '../hooks/useMultiplayer';
import * as THREE from 'three';

const Multiplayer = () => {
  const { camera } = useThree();
  const { players, updateMyPosition } = useMultiplayer();

  useFrame(() => {
    // Send the camera's current world position as your avatar's position.
    const pos = new THREE.Vector3();
    camera.getWorldPosition(pos);
    updateMyPosition([pos.x, pos.y, pos.z]);
  });

  return (
    <>
      {Object.entries(players).map(([id, data]) => (
        <mesh key={id} position={data.position}>
          <boxGeometry args={[0.3, 1, 0.3]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      ))}
    </>
  );
};

export default Multiplayer;
