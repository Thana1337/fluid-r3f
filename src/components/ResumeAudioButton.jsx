import React, { useRef } from 'react';

export default function ResumeAudioButton() {
  const audioContextRef = useRef(new AudioContext());

  const handleClick = () => {
    if (audioContextRef.current.state !== 'running') {
      audioContextRef.current.resume().then(() => {
        console.log('AudioContext resumed');
      });
    }
  };

  return <button onClick={handleClick}>Enable Audio</button>;
}
