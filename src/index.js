import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import { initDatabase, syncLocalStorageToIndexedDB, syncLocalStorageToPGlite } from './config/database';

// Initialize the database with proper error handling
const startApp = async () => {
  try {
    console.log('Starting application...');
    await initDatabase();
    // await syncLocalStorageToIndexedDB();
    await syncLocalStorageToPGlite();
    console.log('Database initialized, rendering app...');
    
    const container = document.getElementById('root');
    const root = createRoot(container);
    root.render(<App />);
  } catch (error) {
    console.error('Failed to start application:', error);
    // Display user-friendly error
    const container = document.getElementById('root');
    container.innerHTML = `
      <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
        <h2>Application Error</h2>
        <p>Failed to initialize the database. Please refresh the page or contact support.</p>
        <p style="color: #666; font-size: 14px;">Technical details: ${error.message}</p>
        <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 20px;">
          Refresh Page
        </button>
      </div>
    `;
  }
}

startApp();

// Add support for hot module replacement
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    const container = document.getElementById('root');
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <NextApp />
      </React.StrictMode>
    );
  });
}