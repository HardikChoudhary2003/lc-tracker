import React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import 'react-loading-skeleton/dist/skeleton.css'; // Import default skeleton styles FIRST
import './styles/responsive.css'; // Import responsive styles
import './styles/darkTheme.css'; // Import dark theme overrides AFTER defaults

// Set the base URL for all Axios requests using the environment variable
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
// Ensure cookies are sent with cross-origin requests
axios.defaults.withCredentials = true;

// Comment out logging interceptors for now
/* 
axios.interceptors.request.use(
  config => {
    console.log(`Axios request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('Axios request error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    console.log(`Axios response: ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    console.error('Axios response error:', error);
    return Promise.reject(error);
  }
);
*/

console.log(`Axios base URL set to: ${axios.defaults.baseURL}`);

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
