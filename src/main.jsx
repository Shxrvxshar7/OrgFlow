import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { makeServer } from './mirage';

// Always enable Mirage JS server for both development and production
makeServer();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
