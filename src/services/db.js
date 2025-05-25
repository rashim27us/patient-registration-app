import { syncLocalStorageToPGlite } from '../config/database';

export const initializeDB = () => {
  console.log('Database initialized (mock)');
  
  if (!localStorage.getItem('patients')) {
    localStorage.setItem('patients', JSON.stringify([]));
  }
  
  return Promise.resolve();
};

export const getPatients = () => {
  try {
    const patients = localStorage.getItem('patients');
    return patients ? JSON.parse(patients) : [];
  } catch (error) {
    console.error('Error getting patients from localStorage:', error);
    return [];
  }
};

export const savePatient = (patient) => {
  try {
    const patients = getPatients();
    const existingPatientIndex = patients.findIndex(p => p.id === patient.id);
    
    if (existingPatientIndex >= 0) {
      patients[existingPatientIndex] = patient;
    } else {
      patients.push(patient);
    }
    localStorage.setItem('patients', JSON.stringify(patients));
    // Sync to pglite after saving
    syncLocalStorageToPGlite();
    return patient;
  } catch (error) {
    console.error('Error saving patient to localStorage:', error);
    throw new Error(`Failed to save patient: ${error.message}`);
  }
};

export const deletePatient = (patientId) => {
  try {
    const patients = getPatients();
    const updatedPatients = patients.filter(patient => patient.id !== patientId);
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
    
    return true;
  } catch (error) {
    console.error('Error deleting patient from localStorage:', error);
    throw new Error(`Failed to delete patient: ${error.message}`);
  }
};
export const getPatientById = (patientId) => {
  try {
    const patients = getPatients();
    return patients.find(patient => patient.id === patientId) || null;
  } catch (error) {
    console.error('Error getting patient by ID:', error);
    return null;
  }
};