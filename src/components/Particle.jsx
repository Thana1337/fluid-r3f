import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Particles = ({
  active = true, // controls whether particles are visible
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
  const materialRef = useRef();

  // Store initial base position so it remains fixed.
  const initialBase = useRef(new THREE.Vector3(...base));

  const positions = useRef(new Float32Array(numParticles * 3));
  const velocities = useRef(new Float32Array(numParticles * 3));

  // Identify the main flow axis (nonzero component in flowDirection)
  const flowAxis = flowDirection.findIndex((val) => val !== 0);

  useEffect(() => {
    for (let i = 0; i < numParticles; i++) {
      // Set the main flow axis position.
      positions.current[i * 3 + flowAxis] =
        Math.random() * spread + initialBase.current.getComponent(flowAxis);

      // Set the other two axes positions (with a small random offset).
      for (let axis = 0; axis < 3; axis++) {
        if (axis !== flowAxis) {
          positions.current[i * 3 + axis] =
            initialBase.current.getComponent(axis) + (Math.random() - 0.5) * 0.5;
        }
      }

      // Set horizontal velocity based on particleSpeed.
      velocities.current[i * 3 + flowAxis] =
        Math.abs(Math.random() * particleSpeed) * flowDirection[flowAxis];

      // Set the velocities on the other axes to 0.
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
    // Smoothly update the material's opacity.
    // Lower the factor (e.g. 0.01) for a slower fade.
    const targetOpacity = active ? 0.7 : 0; 
    if (materialRef.current) {
      materialRef.current.opacity += (targetOpacity - materialRef.current.opacity) * 0.0001;
    }

    const posAttr = particles.current.geometry.attributes.position;
    const velAttr = particles.current.geometry.attributes.velocity;

    // Define a default particle speed for scaling purposes.
    const defaultParticleSpeed = 0.05;
    const speedFactor = particleSpeed / defaultParticleSpeed;

    // Adjust vertical acceleration and curve threshold based on speed.
    const adjustedWaterAcc = waterAcceleration * speedFactor;
    const adjustedSteamAcc = steamAcceleration * speedFactor;
    const adjustedCurveThreshold = curveThreshold / speedFactor;

    for (let i = 0; i < numParticles; i++) {
      const mainIndex = i * 3 + flowAxis;
      // Update horizontal position.
      posAttr.array[mainIndex] += velAttr.array[mainIndex];

      // Calculate the distance traveled along the flow axis.
      const traveled = Math.abs(
        posAttr.array[mainIndex] - initialBase.current.getComponent(flowAxis)
      );

      // Apply vertical acceleration if beyond the threshold.
      if (traveled > adjustedCurveThreshold) {
        const yIndex = i * 3 + 1; // assuming y is vertical
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
    <points ref={particles} frustumCulled={false}>
      <bufferGeometry />
      <pointsMaterial
        ref={materialRef}
        size={particleSize}
        color={color}
        transparent
        opacity={active ? 0.7 : 0} // initial opacity set based on active state
        depthWrite={false}
      />
    </points>
  );
};

export default Particles;
