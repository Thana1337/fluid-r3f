import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Particles = () => {
    const particles = useRef();
  
    const numParticles = 100;
    const positions = new Float32Array(numParticles * 13); 
    const velocities = new Float32Array(numParticles * 3);
  
    useEffect(() => {
      for (let i = 0; i < numParticles; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 0.5 ; // x
        positions[i * 3 + 1] = Math.random() * 5 + 2; // y 
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5; // z
  
        velocities[i * 3] = 0; // no x velocity
        velocities[i * 3 + 1] = -Math.random() * 0.05; // y velocity
        velocities[i * 3 + 2] = 0; // no z velocity
      }
      particles.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      particles.current.geometry.setAttribute(
        "velocity",
        new THREE.BufferAttribute(velocities, 3)
      );
    }, [numParticles]);
  
    useFrame(() => {
      const posAttr = particles.current.geometry.attributes.position;
      const velAttr = particles.current.geometry.attributes.velocity;
  
      for (let i = 0; i < numParticles; i++) {
        posAttr.array[i * 3 + 1] += velAttr.array[i * 3 + 1]; // Apply velocity to y
  
        // Reset particle if goes too low
        if (posAttr.array[i * 3 + 1] < 0 || posAttr.array[i * 3 + 1] > 10) {
          posAttr.array[i * 3 + 1] = Math.random() * 5 + 2; // Reset y
        }
      }
      posAttr.needsUpdate = true;
    });
  
    return (
      <points ref={particles}>
        <bufferGeometry />
        <pointsMaterial
          size={0.2}
          color="blue"
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </points>
    );
  }
export default Particles;