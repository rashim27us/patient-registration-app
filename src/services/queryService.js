import { getDatabase } from '../config/database';

export const queryService = {
  /**
   * Execute a raw SQL query against the IndexedDB database
   * @param {string} sqlQuery - The SQL query to execute
   * @param {Array} params - Optional parameters for parameterized queries
   * @returns {Promise<Array>} - The query results
   */
  async executeRawQuery(sqlQuery, params = []) {
    try {
      console.log('Executing raw query:', sqlQuery);
      
      // Validate the query is SELECT only for safety
      const trimmedQuery = sqlQuery.trim().toUpperCase();
      if (!trimmedQuery.startsWith('SELECT')) {
        throw new Error('Only SELECT queries are allowed for safety reasons');
      }
      
      // Get database connection
      const db = await getDatabase();
      
      const result = await db.query(sqlQuery, params);
      // pglite returns { rows: [...] }
      return { rows: result.rows };
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  },
  
  /**
   * Get table schema information
   * @returns {Promise<Array>} - Array of tables and their columns
   */
  async getSchemaInfo() {
    try {
      console.log('Fetching schema info');
      // For IndexedDB, we'll return the predefined schema since
      // there's no direct way to query it like in SQL databases
      const db = await getDatabase();
      const result = await db.query(`
        SELECT column_name AS name, data_type AS type, is_nullable = 'NO' AS notNull
        FROM information_schema.columns
        WHERE table_name = 'patients'
      `);
      return [
        {
          tableName: 'patients',
          columns: result.rows
        }
      ];
    } catch (error) {
      console.error('Error fetching schema info:', error);
      throw error;
    }
  }
};