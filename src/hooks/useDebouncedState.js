// src/hooks/useDebouncedState.js
import { useState, useRef, useCallback } from "react";

const useDebouncedState = (initialValue, delay = 100) => {
  const [state, setState] = useState(initialValue);
  const timeoutRef = useRef(null);

  const setDebouncedState = useCallback(
    (value) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setState(value);
      }, delay);
    },
    [delay]
  );

  return [state, setDebouncedState];
};

export default useDebouncedState;
