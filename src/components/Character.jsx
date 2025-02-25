import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const Character = ({ color, username, ...props }) => {
  const { scene } = useGLTF('/models/character_model.glb');

  // Clone and modify the scene so that changes don't affect the original.
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.color = new THREE.Color(color);
      }
    });

    return clone;
  }, [scene, color]);

  return (
    <group {...props}>
      <primitive object={clonedScene} />

      {/* Floating Name Above Character */}
      <Html position={[0, 1, 0]} center>
        <div style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: 'white',
          background: 'rgba(0, 0, 0, 0.6)',
          padding: '4px 8px',
          borderRadius: '4px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}>
          {username}
        </div>
      </Html>
    </group>
  );
};

export default Character;
