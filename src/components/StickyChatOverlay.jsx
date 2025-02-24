// StickyChatOverlay.jsx
import React, { useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

const StickyChatOverlay = ({ children, offset = [-0.7, -0.5, -1.5] }) => {
  const { camera } = useThree();
  const groupRef = useRef();

  useEffect(() => {
    if (groupRef.current) {
      // Attach the overlay group as a child of the camera
      camera.add(groupRef.current);
    }
    return () => {
      if (groupRef.current) {
        camera.remove(groupRef.current);
      }
    };
  }, [camera]);

  return (
    <group ref={groupRef} position={offset}>
      <Html transform distanceFactor={1.5} style={{ pointerEvents: 'auto' }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '10px',
          borderRadius: '8px',
          width: '300px',
          fontFamily: 'sans-serif',
          color: 'white'
        }}>
          {children}
        </div>
      </Html>
    </group>
  );
};

export default StickyChatOverlay;
