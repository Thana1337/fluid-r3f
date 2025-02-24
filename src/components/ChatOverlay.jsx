// ChatOverlay.jsx
import React, { useState, useEffect } from 'react';
import useChatHub from '../hooks/useChatHub';
import {Filter} from 'bad-words';

const filter = new Filter();

const ChatOverlay = () => {
  const { messages, sendMessage } = useChatHub();
  const [username, setUsername] = useState('');
  const [inputMessage, setInputMessage] = useState('');

  // On mount, load the username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleSend = () => {
    if (inputMessage.trim() !== '') {
      // Clean the message text
      const cleanedMessage = filter.clean(inputMessage);
      sendMessage(username, cleanedMessage);
      setInputMessage('');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '250px'
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.85)',
        padding: '8px',
        borderBottom: '1px solid gray',
        fontSize: '1.2em',
        textAlign: 'center'
      }}>
        Chat
      </div>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px',
        fontSize: '1em'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '4px' }}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', borderTop: '1px solid gray' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '6px',
            border: 'none',
            outline: 'none'
          }}
        />
        <button onClick={handleSend} style={{
          padding: '6px 12px',
          background: 'teal',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatOverlay;
