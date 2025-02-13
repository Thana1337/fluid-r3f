import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Particles = ({
  numParticles = 100,
  particleSize = 0.05,
  flowDirection = [1, 0, 0],
  base = [-2, 2, 0],
  spread = 5,
  color = "white",
  particleType = "water",
  particleSpeed = 0.05, // Controls horizontal speed
  curveThreshold = spread * 0.7, // Base threshold for starting to curve
  waterAcceleration = -0.001,
  steamAcceleration = 0.001,
}) => {
  const particles = useRef();

  // Store initial base position so it remains fixed
  const initialBase = useRef(new THREE.Vector3(...base));

  const positions = useRef(new Float32Array(numParticles * 3));
  const velocities = useRef(new Float32Array(numParticles * 3)); // note: only storing 3 components per particle

  // Identify the main flow axis (nonzero component in flowDirection)
  const flowAxis = flowDirection.findIndex((val) => val !== 0);

  useEffect(() => {
    for (let i = 0; i < numParticles; i++) {
      // Set the main flow axis position
      positions.current[i * 3 + flowAxis] =
        Math.random() * spread + initialBase.current.getComponent(flowAxis);

      // Set the other two axes positions (a little random offset)
      for (let axis = 0; axis < 3; axis++) {
        if (axis !== flowAxis) {
          positions.current[i * 3 + axis] =
            initialBase.current.getComponent(axis) + (Math.random() - 0.5) * 0.5;
        }
      }

      // Use particleSpeed for horizontal velocity
      velocities.current[i * 3 + flowAxis] =
        Math.abs(Math.random() * particleSpeed) * flowDirection[flowAxis];

      // Set the velocities on the other axes to 0 initially
      for (let axis = 0; axis < 3; axis++) {
        if (axis !== flowAxis) {
          velocities.current[i * 3 + axis] = 0;
        }
      }
    }

    particles.current.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions.current, 3)
    );
    particles.current.geometry.setAttribute(
      "velocity",
      new THREE.BufferAttribute(velocities.current, 3)
    );
  }, [numParticles, particleSpeed, spread, flowAxis]);

  useFrame(() => {
    const posAttr = particles.current.geometry.attributes.position;
    const velAttr = particles.current.geometry.attributes.velocity;

    // Define a default speed that our original tuning was based on.
    const defaultParticleSpeed = 0.05;
    // Calculate scaling factor. If particleSpeed is higher than default,
    // then speedFactor > 1.
    const speedFactor = particleSpeed / defaultParticleSpeed;

    // Scale vertical acceleration based on speed so fast particles curve more.
    const adjustedWaterAcc = waterAcceleration * speedFactor;
    const adjustedSteamAcc = steamAcceleration * speedFactor;

    // Also, lower the threshold so fast particles begin curving sooner.
    const adjustedCurveThreshold = curveThreshold / speedFactor;

    for (let i = 0; i < numParticles; i++) {
      const mainIndex = i * 3 + flowAxis;
      // Update horizontal position
      posAttr.array[mainIndex] += velAttr.array[mainIndex];

      // Calculate traveled distance from initial base along the flow axis.
      const traveled = Math.abs(
        posAttr.array[mainIndex] - initialBase.current.getComponent(flowAxis)
      );

      // When the particle has traveled beyond the adjusted threshold, apply vertical acceleration.
      if (traveled > adjustedCurveThreshold) {
        const yIndex = i * 3 + 1; // assuming y is the vertical axis
        const verticalAcc =
          particleType === "water" ? adjustedWaterAcc : adjustedSteamAcc;
        velAttr.array[yIndex] += verticalAcc;
        posAttr.array[yIndex] += velAttr.array[yIndex];
      }

      // Reset particle if it goes too far.
      const yPos = posAttr.array[i * 3 + 1];
      if (
        traveled > spread ||
        (particleType === "water" && yPos < initialBase.current.y - spread) ||
        (particleType === "steam" && yPos > initialBase.current.y + spread)
      ) {
        posAttr.array[mainIndex] =
          Math.random() * spread + initialBase.current.getComponent(flowAxis);
        posAttr.array[i * 3 + 1] =
          initialBase.current.y + (Math.random() - 0.5) * 1;
        velAttr.array[i * 3 + 1] = 0;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={particles}>
      <bufferGeometry />
      <pointsMaterial
        size={particleSize}
        color={color}
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
};

export default Particles;
