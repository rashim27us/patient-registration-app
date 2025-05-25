import React, { useState, useEffect } from 'react';
import { savePatient } from '../services/db';

const PatientForm = ({ patient, onSaved }) => {
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    address: '',
    medicalHistory: '',
    allergies: ''
  });
  
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState({
    saving: false,
    success: false,
    error: null
  });

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    } else {
      // Clear form for new patient
      setFormData({
        id: Date.now().toString(), // Generate temporary ID
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        email: '',
        address: '',
        medicalHistory: '',
        allergies: ''
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    if (saveStatus.success || saveStatus.error) {
      setSaveStatus({
        saving: false,
        success: false,
        error: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaveStatus({
      saving: true,
      success: false,
      error: null
    });
    
    try {
      await savePatient(formData);
      
      setSaveStatus({
        saving: false,
        success: true,
        error: null
      });
    
      if (typeof onSaved === 'function') {
        onSaved();
      } else {
        console.log('Patient saved successfully, but no onSaved callback was provided');
        
        if (!patient) {
          setFormData({
            id: Date.now().toString(),
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            phoneNumber: '',
            email: '',
            address: '',
            medicalHistory: '',
            allergies: ''
          });
        }
      }
    } catch (error) {
      console.error('Error saving patient:', error);
      
      setSaveStatus({
        saving: false,
        success: false,
        error: 'Failed to save patient information. Please try again.'
      });
    }
  };

  const handleCancel = () => {
    if (typeof onSaved === 'function') {
      onSaved();
    } else {
      setFormData({
        id: Date.now().toString(),
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        email: '',
        address: '',
        medicalHistory: '',
        allergies: ''
      });
      
      setSaveStatus({
        saving: false,
        success: false,
        error: null
      });
    }
  };

  return (
    <div className="patient-form-container">
      {saveStatus.success && (
        <div className="success-message">
          Patient information saved successfully!
        </div>
      )}
      
      {saveStatus.error && (
        <div className="error-banner">
          <p>{saveStatus.error}</p>
          <button onClick={() => setSaveStatus({...saveStatus, error: null})}>
            Dismiss
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <div className="error-message">{errors.firstName}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <div className="error-message">{errors.lastName}</div>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth *</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={errors.dateOfBirth ? 'error' : ''}
            />
            {errors.dateOfBirth && <div className="error-message">{errors.dateOfBirth}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={errors.phoneNumber ? 'error' : ''}
            />
            {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="2"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="medicalHistory">Medical History</label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="allergies">Allergies</label>
            <textarea
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="button secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="button primary" disabled={saveStatus.saving}>
            {saveStatus.saving 
              ? 'Saving...' 
              : (patient ? 'Update Patient' : 'Register Patient')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;