import React, { useState, useEffect } from 'react';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import QueryInterface from './components/QueryInterface';
import SyncStatus from './components/SyncStatus';
import { getPatients, initializeDB, savePatient } from './services/db';
import './styles.css';
import './components/QueryInterface.css';

function App() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', or 'query'
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const setup = async () => {
      try {
        await initializeDB();
        if (isMounted) {
          await loadPatients();
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error setting up app:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    setup();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading patients:', error);
      setPatients([]);
    }
  };

  const handleAddNewClick = () => {
    setSelectedPatient(null);
    setCurrentView('form');
  };

  const handleFormSave = async (patientData) => {
    try {
      await savePatient(patientData);
      await loadPatients();
      setCurrentView('list');
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setCurrentView('form');
  };

  const handleFormCancel = () => {
    setCurrentView('list');
  };

  const handleQueryClick = () => {
    setCurrentView('query');
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Patient Registration System</h1>
        </div>
      </header>
      
      <SyncStatus />
      
      <main className="main-content">
        <div className="actions-bar">
          <div className="tabs">
            <button 
              className={`tab-button ${currentView === 'list' ? 'active' : ''}`}
              onClick={() => setCurrentView('list')}
            >
              Patient Records
            </button>
            <button 
              className={`tab-button ${currentView === 'query' ? 'active' : ''}`}
              onClick={handleQueryClick}
            >
              SQL Query Tool
            </button>
          </div>
          
          {currentView === 'list' && (
            <button 
              className="button primary" 
              onClick={handleAddNewClick}
            >
              Add New Patient
            </button>
          )}
          
          {currentView === 'form' && (
            <button 
              className="button secondary" 
              onClick={handleFormCancel}
            >
              Back to List
            </button>
          )}
          
          {currentView === 'query' && (
            <button 
              className="button secondary" 
              onClick={() => setCurrentView('list')}
            >
              Back to List
            </button>
          )}
        </div>
        
        {currentView === 'list' && (
          <PatientList 
            patients={patients} 
            onEdit={handleEditPatient} 
          />
        )}
        
        {currentView === 'form' && (
          <PatientForm 
            patient={selectedPatient} 
            onSave={handleFormSave} 
            onCancel={handleFormCancel} 
          />
        )}
        
        {currentView === 'query' && (
          <QueryInterface />
        )}
      </main>
    </div>
  );
}

export default App;