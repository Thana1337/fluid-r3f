import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import useMultiplayer from '../hooks/useMultiplayer';
import * as THREE from 'three';
import Character from './Character';

const Multiplayer = () => {
  const { camera } = useThree();
  const { players, updateMyPosition } = useMultiplayer();
  const colorMap = useRef({});
  const username = localStorage.getItem('username') || 'Player';

  useFrame(() => {
    // Get player's position
    const pos = new THREE.Vector3();
    camera.getWorldPosition(pos);

    // Get player's rotation (yaw only)
    const euler = new THREE.Euler();
    const quaternion = camera.quaternion; 
    euler.setFromQuaternion(quaternion, "YXZ");

    // Apply correction to the rotation
    const correctedYaw = euler.y + Math.PI/2; 

    updateMyPosition([pos.x, pos.y, pos.z, correctedYaw, username]); // Send position + rotation
  });

  return (
    <>
      {Object.entries(players).map(([id, data]) => {
        if (!colorMap.current[id]) {
          colorMap.current[id] = '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
        const color = colorMap.current[id];

        return (
          <Character 
            key={id} 
            color={color} 
            position={[data.position[0], data.position[1] - 1.2, data.position[2]]}
            rotation={[0, data.position[3] || 0, 0]}
            scale={1.3} 
            username={data.position[4] || 'Player'}
          />
        );
      })}
    </>
  );
};

export default Multiplayer;
