// src/utils/animations.js
export const animatePosition = (object, targetPosition, speed = 0.1) => {
    if (!object.position) return;
    object.position.lerp(targetPosition, speed);
  };
  
  export const animateRotation = (object, targetRotation, speed = 0.1) => {
    if (!object.rotation) return;
    object.rotation.lerp(targetRotation, speed);
  };