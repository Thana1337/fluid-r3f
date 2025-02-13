import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Particles = ({
  numParticles = 100,
  particleSize = 0.2,
  flowDirection = [1, 0, 0],
  base = [-2, 2, 0], 
  spread = 5,
  color = "white",
  particleType = "water",
  curveThreshold = spread * 0.7,
  waterAcceleration = -0.001,
  steamAcceleration = 0.001,
}) => {
  const particles = useRef();
  
  // Store initial base position so it remains fixed
  const initialBase = useRef(new THREE.Vector3(...base));

  const positions = useRef(new Float32Array(numParticles * 3));
  const velocities = useRef(new Float32Array(numParticles * 3));

  // Identify the main flow axis (nonzero component in flowDirection)
  const flowAxis = flowDirection.findIndex((val) => val !== 0);

  useEffect(() => {
    for (let i = 0; i < numParticles; i++) {
      // Use the stored base instead of dynamic base
      positions.current[i * 3 + flowAxis] = Math.random() * spread + initialBase.current.getComponent(flowAxis);

      for (let axis = 0; axis < 3; axis++) {
        if (axis !== flowAxis) {
          positions.current[i * 3 + axis] = initialBase.current.getComponent(axis) + (Math.random() - 0.5) * 0.5;
        }
      }

      velocities.current[i * 3 + flowAxis] = Math.abs(Math.random() * 0.05) * flowDirection[flowAxis];

      for (let axis = 0; axis < 3; axis++) {
        if (axis !== flowAxis) {
          velocities.current[i * 3 + axis] = 0;
        }
      }
    }

    particles.current.geometry.setAttribute("position", new THREE.BufferAttribute(positions.current, 3));
    particles.current.geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities.current, 3));
  }, []); // Empty dependency array ensures it only runs once (not reset on teleport)

  useFrame(() => {
    const posAttr = particles.current.geometry.attributes.position;
    const velAttr = particles.current.geometry.attributes.velocity;

    for (let i = 0; i < numParticles; i++) {
      const mainIndex = i * 3 + flowAxis;
      posAttr.array[mainIndex] += velAttr.array[mainIndex];

      // Calculate travel distance from initialBase (not from XROrigin)
      const traveled = Math.abs(posAttr.array[mainIndex] - initialBase.current.getComponent(flowAxis));

      if (traveled > curveThreshold) {
        const yIndex = i * 3 + 1;
        const verticalAcc = particleType === "water" ? waterAcceleration : steamAcceleration;
        velAttr.array[yIndex] += verticalAcc;
        posAttr.array[yIndex] += velAttr.array[yIndex];
      }

      const yPos = posAttr.array[i * 3 + 1];
      if (
        traveled > spread ||
        (particleType === "water" && yPos < initialBase.current.y - spread) ||
        (particleType === "steam" && yPos > initialBase.current.y + spread)
      ) {
        posAttr.array[mainIndex] = Math.random() * spread + initialBase.current.getComponent(flowAxis);
        posAttr.array[i * 3 + 1] = initialBase.current.y + (Math.random() - 0.5) * 0.5;
        velAttr.array[i * 3 + 1] = 0;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={particles}>
      <bufferGeometry />
      <pointsMaterial size={particleSize} color={color} transparent opacity={0.7} depthWrite={false} />
    </points>
  );
};

export default Particles;
