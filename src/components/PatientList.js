import React, { useState, useEffect } from 'react';
import { getPatients, deletePatient } from '../services/db';
import './PatientList.css';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    try {
      const loadedPatients = getPatients();
      setPatients(loadedPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
      setSaveError('Failed to load patient data. Please refresh the page.');
    }
  };

  const handleDelete = async (patientId) => {
    try {
      await deletePatient(patientId);
      loadPatients(); // Reload the list after delete
      setShowDeleteModal(false);
      setPatientToDelete(null);
    } catch (error) {
      console.error('Error deleting patient:', error);
      setSaveError('Failed to delete patient. Please try again.');
    }
  };

  const confirmDelete = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPatientToDelete(null);
  };

  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const email = (patient.email || '').toLowerCase();
    const phone = (patient.phoneNumber || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) || 
           email.includes(searchLower) || 
           phone.includes(searchLower);
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let aValue = a[sortBy] || '';
    let bValue = b[sortBy] || '';

    if (sortBy === 'dateOfBirth') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName && firstName[0] ? firstName[0].toUpperCase() : '';
    const last = lastName && lastName[0] ? lastName[0].toUpperCase() : '';
    return first + last;
  };

  return (
    <div className="patient-list-container">
      {saveError && (
        <div className="error-banner">
          <p>{saveError}</p>
          <button onClick={() => setSaveError(null)}>Dismiss</button>
        </div>
      )}

      <div className="patient-list-header">
        <h2>Patient Directory</h2>
        <div className="patient-count">
          {sortedPatients.length} patient{sortedPatients.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="patient-list-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="sort-container">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="lastName">Last Name</option>
            <option value="firstName">First Name</option>
            <option value="email">Email</option>
            <option value="dateOfBirth">Date of Birth</option>
            <option value="phoneNumber">Phone</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {sortedPatients.length === 0 ? (
        <div className="no-patients">
          <div className="no-patients-icon">👥</div>
          <h3>No patients found</h3>
          <p>
            {searchTerm
              ? 'No patients match your search criteria.'
              : 'No patients registered yet.'}
          </p>
        </div>
      ) : (
        <div className="patient-grid">
          {sortedPatients.map((patient) => (
            <div key={patient.id} className="patient-card">
              <div className="patient-avatar">
                {getInitials(patient.firstName, patient.lastName)}
              </div>
              
              <div className="patient-info">
                <h3 className="patient-name">
                  {patient.firstName} {patient.lastName}
                </h3>
                <div className="patient-details">
                  <div className="detail-item">
                    <span className="detail-icon">📧</span>
                    <span className="detail-text">
                      {patient.email || 'No email provided'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📱</span>
                    <span className="detail-text">
                      {patient.phoneNumber || 'No phone provided'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🎂</span>
                    <span className="detail-text">
                      {formatDate(patient.dateOfBirth)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⚥</span>
                    <span className="detail-text">
                      {patient.gender || 'Not specified'}
                    </span>
                  </div>
                  {patient.address && (
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">{patient.address}</span>
                    </div>
                  )}
                </div>
                
                {(patient.medicalHistory || patient.allergies) && (
                  <div className="patient-medical-info">
                    {patient.medicalHistory && (
                      <div className="medical-item">
                        <h4>Medical History</h4>
                        <p>{patient.medicalHistory}</p>
                      </div>
                    )}
                    {patient.allergies && (
                      <div className="medical-item">
                        <h4>Allergies</h4>
                        <p>{patient.allergies}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="patient-actions">
                <button className="edit-btn" title="Edit Patient">
                  ✏️ Edit
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => confirmDelete(patient)}
                  title="Delete Patient"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete{' '}
                <strong>
                  {patientToDelete?.firstName} {patientToDelete?.lastName}
                </strong>?
              </p>
              <p className="warning-text">
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-btn" 
                onClick={() => handleDelete(patientToDelete.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;