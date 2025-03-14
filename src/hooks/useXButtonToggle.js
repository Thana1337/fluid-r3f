import { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const useXButtonToggle = () => {
  const { gl } = useThree();
  const [menuOpen, setMenuOpen] = useState(false);
  const xButtonPrevRef = useRef(false);

  useFrame(() => {
    const session = gl.xr.getSession();
    if (session) {
      for (const inputSource of session.inputSources) {
        if (
          inputSource.gamepad &&
          inputSource.handedness === 'left' &&
          inputSource.gamepad.buttons.length > 4
        ) {
          const xButton = inputSource.gamepad.buttons[4];
          const xPressed = xButton.pressed;
          if (xPressed && !xButtonPrevRef.current) {
            setMenuOpen(prev => !prev);
          }
          xButtonPrevRef.current = xPressed;
        }
      }
    }
  });

  return menuOpen;
};

export default useXButtonToggle;
