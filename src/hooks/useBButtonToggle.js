// useBButtonToggle.js
import { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const useBButtonToggle = () => {
  const { gl } = useThree();
  const [actionActive, setActionActive] = useState(false);
  const bButtonPrevRef = useRef(false);

  useFrame(() => {
    const session = gl.xr.getSession();
    if (session) {
      for (const inputSource of session.inputSources) {
        if (inputSource.gamepad && inputSource.handedness === 'right') {
          const bButton = inputSource.gamepad.buttons[5];
          const bPressed = bButton.pressed;
          if (bPressed && !bButtonPrevRef.current) {
            setActionActive(prev => !prev);
          }
          bButtonPrevRef.current = bPressed;
        }
      }
    }
  });

  return actionActive;
};

export default useBButtonToggle;
