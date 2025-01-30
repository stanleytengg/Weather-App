import React, { useState, useEffect } from 'react';

function App() {
  const [backendMessage, setBackendMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/test')
      .then(response => response.json())
      .then(data => {
        console.log('Data received:', data);
        setBackendMessage(data.message);
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Error connecting to backend');
      });
  }, []);

  return;
}

export default App;