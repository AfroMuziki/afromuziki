import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    axios.get('/api/health')
      .then(response => setMessage(response.data.status))
      .catch(error => setMessage('Backend not connected'));
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>🎵 AfroMuziki</h1>
      <p>Status: {message}</p>
      <p>Your African music and video streaming platform</p>
    </div>
  );
}

export default App;
