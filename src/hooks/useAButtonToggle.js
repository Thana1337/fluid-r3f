import { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const useAButtonPressed = () => {
  const { gl } = useThree();
  const [justPressed, setJustPressed] = useState(false);
  const aButtonPrevRef = useRef(false);

  useFrame(() => {
    const session = gl.xr.getSession();
    if (session) {
      for (const inputSource of session.inputSources) {
        if (
          inputSource.gamepad &&
          inputSource.handedness === 'right' &&
          inputSource.gamepad.buttons.length > 4 // Ensure button at index 4 exists
        ) {
          const aButton = inputSource.gamepad.buttons[4];
          const aPressed = aButton.pressed;
          if (aPressed && !aButtonPrevRef.current) {
            setJustPressed(true);
          } else {
            setJustPressed(false);
          }
          aButtonPrevRef.current = aPressed;
        }
      }
    }
  });

  return justPressed;
};

export default useAButtonPressed;
