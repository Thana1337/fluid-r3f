// src/components/PublishLocalAudio.jsx
import React, { useEffect } from 'react';
import { useLocalParticipant } from '@livekit/components-react';

export default function PublishLocalAudio() {
  const { localParticipant } = useLocalParticipant();

  useEffect(() => {
    async function publishAudio() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioTrack = stream.getAudioTracks()[0];
        await localParticipant.publishTrack(audioTrack, {
          name: 'microphone',
          source: 'microphone',
        });
      } catch (err) {
        console.error('Failed to publish audio track', err);
      }
    }
    publishAudio();
  }, [localParticipant]);

  return null;
}
