import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { makeServer } from './mirage';

// Start the Mirage JS server in development
if (process.env.NODE_ENV !== 'production') {
  makeServer();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
