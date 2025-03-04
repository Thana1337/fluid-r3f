// useAButtonToggle.js
import { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const useAButtonToggle = () => {
  const { gl } = useThree();
  const [actionActive, setActionActive] = useState(false);
  const aButtonPrevRef = useRef(false);

  useFrame(() => {
    const session = gl.xr.getSession();
    if (session) {
      for (const inputSource of session.inputSources) {
        if (inputSource.gamepad && inputSource.handedness === 'right') {
          const aButton = inputSource.gamepad.buttons[4];
          const aPressed = aButton.pressed;
          if (aPressed && !aButtonPrevRef.current) {
            setActionActive(prev => !prev);
          }
          aButtonPrevRef.current = aPressed;
        }
      }
    }
  });

  return actionActive;
};

export default useAButtonToggle;
