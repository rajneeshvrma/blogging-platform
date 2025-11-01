import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AppProvider } from './context/AuthContext.jsx';
import axios from 'axios'; 
import { BrowserRouter as Router } from 'react-router-dom';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
        {/* The App component now contains the Router */}
        <App />
    </AppProvider>
  </React.StrictMode>,
);