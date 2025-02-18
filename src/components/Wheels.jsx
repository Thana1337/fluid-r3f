import React, { useState, useEffect } from "react";
import GLBModel from "./GLBModel";

const Wheels = ({ leftSpin: leftTarget, rightSpin: rightTarget }) => {
  // Local state for the current spin speeds
  const [leftSpeed, setLeftSpeed] = useState(leftTarget);
  const [rightSpeed, setRightSpeed] = useState(rightTarget);

  // Update leftSpeed gradually toward leftTarget
  useEffect(() => {
    let frameId;
    const updateLeftSpeed = () => {
      setLeftSpeed((current) => {
        const diff = leftTarget - current;
        // If the difference is very small, snap to target.
        if (Math.abs(diff) < 0.01) return leftTarget;
        // Increment the speed by a fraction of the difference.
        return current + diff * 0.003;
      });
      frameId = requestAnimationFrame(updateLeftSpeed);
    };
    updateLeftSpeed();
    return () => cancelAnimationFrame(frameId);
  }, [leftTarget]);

  // Update rightSpeed gradually toward rightTarget
  useEffect(() => {
    let frameId;
    const updateRightSpeed = () => {
      setRightSpeed((current) => {
        const diff = rightTarget - current;
        if (Math.abs(diff) < 0.01) return rightTarget;
        return current + diff * 0.005;
      });
      frameId = requestAnimationFrame(updateRightSpeed);
    };
    updateRightSpeed();
    return () => cancelAnimationFrame(frameId);
  }, [rightTarget]);

  return (
    <>
      {/* Right Wheel controlled by the right pipe */}
      <GLBModel
        path="models/wheel.glb"
        animationSpeed={rightSpeed}
        position={[8, 2, -5]}
        scale={[1, 1, 1]}
      />
      <GLBModel
        path="models/generator_small.glb"
        animationSpeed={rightSpeed}
        position={[5, 0, -9]}
        scale={[1, 1, 1]}
      />
      {/* Left Wheel controlled by the left pipe */}
      <GLBModel
        path="models/wheel.glb"
        animationSpeed={leftSpeed}
        position={[-8, 2, -5]}
        scale={[1, 1, 1]}
      />
      <GLBModel
        path="models/generator_small.glb"
        animationSpeed={leftSpeed}
        position={[-5, 0, -9]}
        scale={[1, 1, 1]}
        rotation={[0,Math.PI/1,0]}
      />
    </>
  );
};

export default Wheels;
