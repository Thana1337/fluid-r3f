// ChatOverlay.jsx
import React, { useState, useEffect } from 'react';
import useChatHub from '../hooks/useChatHub';
import {Filter} from 'bad-words';

const filter = new Filter();

const ChatOverlay = () => {
  const { messages, sendMessage } = useChatHub();
  const [username, setUsername] = useState('');
  const [hasSetUsername, setHasSetUsername] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [error, setError] = useState('');

  // On mount, check if a username is stored in localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setHasSetUsername(true);
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

  const handleSetUsername = () => {
    const trimmedName = username.trim();
    if (trimmedName === '') {
      setError('Username cannot be empty.');
      return;
    }
    // Check for profanity using bad-words filter
    if (filter.isProfane(trimmedName)) {
      setError('Username contains inappropriate language. Please choose a different name.');
      return;
    }
    // Save username in localStorage so it persists across sessions
    localStorage.setItem('username', trimmedName);
    setHasSetUsername(true);
    setError('');
  };

  // Prompt for username if it hasn't been set
  if (!hasSetUsername) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '150px'
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.85)',
          padding: '8px',
          borderBottom: '1px solid gray',
          fontSize: '1.2em',
          textAlign: 'center'
        }}>
          Enter Your Username
        </div>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <input
            type="text"
            value={username}
            onChange={e => {
              setUsername(e.target.value);
              setError('');
            }}
            placeholder="Username..."
            style={{
              padding: '6px',
              width: '80%',
              border: 'none',
              outline: 'none'
            }}
          />
          {error && <span style={{ color: 'red', marginTop: '4px' }}>{error}</span>}
          <button onClick={handleSetUsername} style={{
            marginTop: '10px',
            padding: '6px 12px',
            background: 'teal',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}>
            Set
          </button>
        </div>
      </div>
    );
  }

  // Once the username is set, display the chat UI
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
