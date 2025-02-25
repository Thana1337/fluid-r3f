import React, { useState, useEffect } from 'react';
import { Text } from '@react-three/drei';
import { Filter } from 'bad-words';
import useChatHub from '../hooks/useChatHub';
import VirtualKeyboard from './VirtualKeyboard';

const filter = new Filter();

const ChatOverlay3D = () => {
  const { messages, sendMessage } = useChatHub();
  const [username, setUsername] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);

  // Load username on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleSend = () => {
    if (inputMessage.trim() !== '') {
      const cleanedMessage = filter.clean(inputMessage);
      sendMessage(username, cleanedMessage);
      setInputMessage('');
      setShowKeyboard(false);
    }
  };

  const handleKeyPress = (key) => {
    setInputMessage(prev => prev + key);
  };

  const handleBackspace = () => {
    setInputMessage(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    handleSend();
  };

  return (
    <group>
      {/* Overall overlay background */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial color="black" opacity={0.8} transparent />
      </mesh>

      {/* Header panel */}
      <mesh position={[0, 1, 0.01]}>
        <planeGeometry args={[1.5, 0.15]} />
        <meshBasicMaterial color="black" opacity={0.9} transparent />
      </mesh>
      <Text
        position={[0, 1, 0.02]}
        fontSize={0.06}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Chat
      </Text>

      {/* Messages area */}
      <group position={[-0.65, 0.25, 0.02]}>
        {messages.map((msg, index) => (
          <Text
            key={index}
            position={[0, -index * 0.06, 0]}
            fontSize={0.04}
            color="white"
            anchorX="left"
            anchorY="top"
            maxWidth={1.4}
          >
            {msg.user}: {msg.message}
          </Text>
        ))}
      </group>

      {/* Input area background */}
      <mesh position={[-0.4, -0.45, 0.01]}>
        <planeGeometry args={[1.5, 0.2]} />
        <meshBasicMaterial color="white" opacity={0.85} transparent />
      </mesh>

      {/* Input field area (clickable to show keyboard) */}
      <mesh
        position={[-0.4, -0.45, 0.02]}
        onPointerDown={() => {
          console.log("Input field clicked");
          setShowKeyboard(true);
        }}
      >
        <planeGeometry args={[1.5, 0.2]} />
        <meshBasicMaterial color="gray" opacity={0.5} transparent />
      </mesh>
      <Text
        position={[-1, -0.45, 0.03]}
        fontSize={0.04}
        color="black"
        anchorX="left"
        anchorY="middle"
      >
        {inputMessage || "Type a message..."}
      </Text>

      {/* Send button */}
      <mesh
        position={[0.65, -0.45, 0.02]}
        onClick={handleSend}
      >
        <planeGeometry args={[0.4, 0.2]} />
        <meshBasicMaterial color="teal" />
      </mesh>
      <Text
        position={[0.65, -0.45, 0.03]}
        fontSize={0.04}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Send
      </Text>

      {/* Virtual Keyboard overlay (pop-up) */}
      {showKeyboard && (
        <VirtualKeyboard 
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onEnter={handleEnter}
          position={[0, -0.8, 0]} 
        />
      )}
    </group>
  );
};

export default ChatOverlay3D;
