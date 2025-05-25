import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { initDatabase } from './config/database';
import { createSchema } from './db/schema';

// Initialize database before rendering the app
const startApp = async () => {
  try {
    await initDatabase();
    await createSchema();
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize application:', error);
    // Show error to user
    document.getElementById('root').innerHTML = `
      <div style="color: red; text-align: center; margin-top: 50px;">
        <h1>Application Error</h1>
        <p>Failed to initialize the database. Please refresh the page or contact support.</p>
      </div>
    `;
  }
};

startApp();

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