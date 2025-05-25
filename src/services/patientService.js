import { getDatabase } from '../config/database';

export const patientService = {
  // Create a new patient
  async createPatient(patientData) {
    const db = getDatabase();
    
    try {
      // Start transaction
      await db.query('BEGIN');
      
      // Insert patient basic info
      const { rows } = await db.query(`
        INSERT INTO patients 
        (first_name, last_name, dob, gender, email, phone, address) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING id
      `, [
        patientData.firstName,
        patientData.lastName,
        patientData.dob,
        patientData.gender,
        patientData.email,
        patientData.phone,
        patientData.address
      ]);
      
      const patientId = rows[0].id;
      
      // Insert medical history if provided
      if (patientData.medicalHistory && patientData.medicalHistory.length > 0) {
        for (const history of patientData.medicalHistory) {
          await db.query(`
            INSERT INTO medical_history 
            (patient_id, condition, diagnosis_date, notes) 
            VALUES ($1, $2, $3, $4)
          `, [patientId, history.condition, history.diagnosisDate, history.notes]);
        }
      }
      
      // Insert allergies if provided
      if (patientData.allergies && patientData.allergies.length > 0) {
        for (const allergy of patientData.allergies) {
          await db.query(`
            INSERT INTO allergies 
            (patient_id, allergen, severity, notes) 
            VALUES ($1, $2, $3, $4)
          `, [patientId, allergy.allergen, allergy.severity, allergy.notes]);
        }
      }
      
      // Commit transaction
      await db.query('COMMIT');
      
      return { id: patientId, ...patientData };
    } catch (error) {
      // Rollback transaction on error
      await db.query('ROLLBACK');
      console.error('Error creating patient:', error);
      throw error;
    }
  },
  
  // Get all patients
  async getAllPatients() {
    const db = getDatabase();
    
    try {
      const { rows } = await db.query(`
        SELECT * FROM patients 
        ORDER BY last_name, first_name
      `);
      
      return rows;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },
  
  // Get patient by ID with full details
  async getPatientById(id) {
    const db = getDatabase();
    
    try {
      // Start transaction for consistent read
      await db.query('BEGIN');
      
      // Get patient basic info
      const { rows: patientRows } = await db.query(`
        SELECT * FROM patients WHERE id = $1
      `, [id]);
      
      if (patientRows.length === 0) {
        await db.query('ROLLBACK');
        return null;
      }
      
      const patient = patientRows[0];
      
      // Get medical history
      const { rows: historyRows } = await db.query(`
        SELECT * FROM medical_history 
        WHERE patient_id = $1
        ORDER BY diagnosis_date DESC
      `, [id]);
      
      // Get allergies
      const { rows: allergyRows } = await db.query(`
        SELECT * FROM allergies 
        WHERE patient_id = $1
        ORDER BY allergen
      `, [id]);
      
      // End transaction
      await db.query('COMMIT');
      
      return {
        ...patient,
        medicalHistory: historyRows,
        allergies: allergyRows
      };
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error fetching patient details:', error);
      throw error;
    }
  },
  
  // Update patient information
  async updatePatient(id, patientData) {
    const db = getDatabase();
    
    try {
      await db.query('BEGIN');
      
      // Update patient basic info
      await db.query(`
        UPDATE patients 
        SET first_name = $1, 
            last_name = $2, 
            dob = $3, 
            gender = $4, 
            email = $5, 
            phone = $6, 
            address = $7,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
      `, [
        patientData.firstName,
        patientData.lastName,
        patientData.dob,
        patientData.gender,
        patientData.email,
        patientData.phone,
        patientData.address,
        id
      ]);
      
      // Handle medical history updates if provided
      if (patientData.medicalHistory) {
        // Delete existing records and insert new ones
        await db.query('DELETE FROM medical_history WHERE patient_id = $1', [id]);
        
        for (const history of patientData.medicalHistory) {
          await db.query(`
            INSERT INTO medical_history 
            (patient_id, condition, diagnosis_date, notes) 
            VALUES ($1, $2, $3, $4)
          `, [id, history.condition, history.diagnosisDate, history.notes]);
        }
      }
      
      // Handle allergies updates if provided
      if (patientData.allergies) {
        // Delete existing records and insert new ones
        await db.query('DELETE FROM allergies WHERE patient_id = $1', [id]);
        
        for (const allergy of patientData.allergies) {
          await db.query(`
            INSERT INTO allergies 
            (patient_id, allergen, severity, notes) 
            VALUES ($1, $2, $3, $4)
          `, [id, allergy.allergen, allergy.severity, allergy.notes]);
        }
      }
      
      await db.query('COMMIT');
      
      return { id, ...patientData };
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error updating patient:', error);
      throw error;
    }
  },
  
  // Delete patient
  async deletePatient(id) {
    const db = getDatabase();
    
    try {
      // Child records will be deleted via cascade
      await db.query('DELETE FROM patients WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  },
  
  // Search patients
  async searchPatients(searchTerm) {
    const db = getDatabase();
    
    try {
      const searchPattern = `%${searchTerm}%`;
      
      const { rows } = await db.query(`
        SELECT * FROM patients 
        WHERE first_name ILIKE $1 
           OR last_name ILIKE $1
           OR email ILIKE $1
           OR phone ILIKE $1
           OR address ILIKE $1
        ORDER BY last_name, first_name
      `, [searchPattern]);
      
      return rows;
    } catch (error) {
      console.error('Error searching patients:', error);
      throw error;
    }
  }
};