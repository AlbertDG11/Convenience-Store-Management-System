// src/index.js
// ────────────────────────────────────────────────────────────
// React entry point: mounts <App/> inside public/index.html’s #root
// This file should stay very small – all routing lives in App.js.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// React 18 root API
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
