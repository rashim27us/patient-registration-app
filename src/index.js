import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initDatabase } from './config/database';

// Initialize the database when the application starts
async function initApp() {
  try {
    // Initialize the database
    await initDatabase();
    console.log('Database initialized successfully');
    
    // Render the React application
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize the application:', error);
    // Display an error message to the user
    const rootElement = document.getElementById('root');
    rootElement.innerHTML = `
      <div style="color: red; text-align: center; margin-top: 50px;">
        <h1>Application Error</h1>
        <p>Failed to initialize the database. Please try again later.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}

initApp();

// Add support for hot module replacement
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <NextApp />
      </React.StrictMode>
    );
  });
}