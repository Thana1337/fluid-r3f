// src/components/Particles.jsx
import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Particles that flow out from a pipe and then curve vertically.
 * 
 * Props:
 * - numParticles: number of particles.
 * - particleSize: size of each particle.
 * - flowDirection: a vector [dx, dy, dz] defining the primary exit direction.
 *   (Only one component should be nonzero, which is considered the “main” axis.)
 * - base: an array [x, y, z] defining the starting position.
 * - spread: the distance along the flow axis over which the particle is active.
 * - color: particle color.
 * - particleType: "water" or "steam".
 * 
 * When a particle travels a certain distance (curveThreshold) along the main flow,
 * we start adding vertical acceleration:
 *   - For water: a negative acceleration (simulating a drop).
 *   - For steam: a positive acceleration (simulating a rise).
 */
const Particles = ({
  numParticles = 100,
  particleSize = 0.2,
  flowDirection = [1, 0, 0], // primary flow axis (e.g. horizontal)
  base = [-2, 2, 0],         // starting position (x, y, z)
  spread = 5,                // how far the particle travels along the flow axis before reset
  color = "white",
  particleType = "water",    // "water" or "steam"
  // The distance along the flow axis after which we begin vertical acceleration.
  curveThreshold = spread * 0.7,
  // Vertical accelerations (adjust these to get the desired curve effect)
  waterAcceleration = -0.001, // water will accelerate downward
  steamAcceleration = 0.001   // steam will accelerate upward
}) => {
  const particles = useRef();
  const positions = new Float32Array(numParticles * 3);
  const velocities = new Float32Array(numParticles * 3);

  // Determine the “main” flow axis.
  // We assume only one component of flowDirection is nonzero.
  const flowAxis = flowDirection.findIndex(val => val !== 0);

  useEffect(() => {
    for (let i = 0; i < numParticles; i++) {
      // Initialize the position along the main flow axis randomly within [base, base+spread].
      positions[i * 3 + flowAxis] = Math.random() * spread + base[flowAxis];

      // For the other axes, start near the base position with a slight random offset.
      for (let axis = 0; axis < 3; axis++) {
        if (axis !== flowAxis) {
          positions[i * 3 + axis] = base[axis] + (Math.random() - 0.5) * 0.5;
        }
      }

      // Set velocity along the main flow axis (preserving its direction).
      velocities[i * 3 + flowAxis] = Math.abs(Math.random() * 0.05) * flowDirection[flowAxis];

      // Initialize other velocity components (for example, vertical) to zero.
      for (let axis = 0; axis < 3; axis++) {
        if (axis !== flowAxis) {
          velocities[i * 3 + axis] = 0;
        }
      }
    }

    particles.current.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particles.current.geometry.setAttribute(
      "velocity",
      new THREE.BufferAttribute(velocities, 3)
    );
  }, [numParticles, flowDirection, base, spread, flowAxis]);

  useFrame(() => {
    const posAttr = particles.current.geometry.attributes.position;
    const velAttr = particles.current.geometry.attributes.velocity;

    for (let i = 0; i < numParticles; i++) {
      // Update the main flow axis.
      const mainIndex = i * 3 + flowAxis;
      posAttr.array[mainIndex] += velAttr.array[mainIndex];

      // Calculate how far the particle has traveled along the main axis.
      const traveled = Math.abs(posAttr.array[mainIndex] - base[flowAxis]);

      // If the particle has traveled beyond the curveThreshold, begin applying vertical acceleration.
      if (traveled > curveThreshold) {
        // We assume the vertical axis is 1 (y axis).
        const yIndex = i * 3 + 1;
        // Choose the vertical acceleration based on the particle type.
        const verticalAcc = particleType === "water" ? waterAcceleration : steamAcceleration;
        // Increase the vertical component of velocity.
        velAttr.array[yIndex] += verticalAcc;
        // Update the y position.
        posAttr.array[yIndex] += velAttr.array[yIndex];
      }

      // Reset the particle if it goes too far.
      // Here we reset if it exceeds the spread along the main axis,
      // or if the vertical position goes out of a reasonable range.
      const yPos = posAttr.array[i * 3 + 1];
      if (
        traveled > spread ||
        (particleType === "water" && yPos < base[1] - spread) ||
        (particleType === "steam" && yPos > base[1] + spread)
      ) {
        // Reset the main flow axis position randomly within [base, base+spread].
        posAttr.array[mainIndex] = Math.random() * spread + base[flowAxis];
        // Reset the vertical (y) position close to the base.
        posAttr.array[i * 3 + 1] = base[1] + (Math.random() - 0.5) * 0.5;
        // Also reset the vertical velocity.
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
