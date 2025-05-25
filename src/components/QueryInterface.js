import React, { useState, useEffect } from 'react';
import { queryService } from '../services/queryService';
import './QueryInterface.css';

const QueryInterface = () => {
  const [query, setQuery] = useState('SELECT * FROM patients LIMIT 10');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [schemaInfo, setSchemaInfo] = useState([]);
  const [showSchema, setShowSchema] = useState(false);
  const [resultCount, setResultCount] = useState(0);
  const [executionTime, setExecutionTime] = useState(null);

  // Load schema information on component mount
  useEffect(() => {
    const loadSchemaInfo = async () => {
      try {
        const schema = await queryService.getSchemaInfo();
        setSchemaInfo(schema);
      } catch (err) {
        console.error('Failed to load schema:', err);
      }
    };
    
    loadSchemaInfo();
  }, []);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a SQL query');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setResults([]);
    
    const startTime = performance.now();
    
    try {
      const data = await queryService.executeRawQuery(query);
      const endTime = performance.now();
      
      console.log('Query results:', data.rows);
      
      setResults(data.rows);
      setResultCount(data.rows.length);
      setExecutionTime((endTime - startTime).toFixed(2));
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      setExecutionTime(null);
    }
  };

  const handleSampleQuery = (sampleQuery) => {
    setQuery(sampleQuery);
  };

  const toggleSchema = () => {
    setShowSchema(!showSchema);
  };

  // Debugging: Check indexedDB content
  indexedDB.open('patientDB').onsuccess = function(e) {
    const db = e.target.result;
    const tx = db.transaction('patients', 'readonly');
    const store = tx.objectStore('patients');
    store.getAll().onsuccess = function(ev) { console.log(ev.target.result); };
  };

  return (
    <div className="query-interface-container">
      <h2>SQL Query Interface</h2>
      <p className="query-description">
        Execute SELECT queries against the patient database. Use this tool to analyze patient data with custom SQL queries.
      </p>
      
      <div className="query-help-section">
        <button 
          className="button secondary small" 
          onClick={toggleSchema}
        >
          {showSchema ? 'Hide Schema' : 'Show Schema'}
        </button>
        
        {showSchema && (
          <div className="schema-info">
            <h3>Database Schema</h3>
            {schemaInfo.map(table => (
              <div key={table.tableName} className="table-schema">
                <h4>{table.tableName}</h4>
                <ul>
                  {table.columns.map(column => (
                    <li key={column.name}>
                      <strong>{column.name}</strong> ({column.type})
                      {column.isPrimaryKey && ' 🔑'}
                      {column.notNull && ' [NOT NULL]'}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        
        <div className="sample-queries">
          <h3>Sample Queries</h3>
          <div className="sample-query-buttons">
            <button 
              className="button secondary small" 
              onClick={() => handleSampleQuery('SELECT * FROM patients LIMIT 10')}
            >
              List Patients
            </button>
            <button 
              className="button secondary small" 
              onClick={() => handleSampleQuery('SELECT * FROM patients WHERE lastName LIKE "%smith%" LIMIT 5')}
            >
              Find Patients by Name
            </button>
            <button 
              className="button secondary small" 
              onClick={() => handleSampleQuery('SELECT * FROM patients LIMIT 5')}
            >
              First 5 Patients
            </button>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleQuerySubmit} className="query-form">
        <div className="query-input-container">
          <label htmlFor="sql-query">SQL Query (SELECT only)</label>
          <textarea
            id="sql-query"
            value={query}
            onChange={handleQueryChange}
            placeholder="Enter your SQL query here (e.g., SELECT * FROM patients LIMIT 10)"
            rows="5"
            className="query-input"
          />
        </div>
        
        <div className="query-actions">
          <button 
            type="submit" 
            className="button primary"
            disabled={isLoading}
          >
            {isLoading ? 'Executing...' : 'Execute Query'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="query-error">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {results.length > 0 && (
        <div className="query-results">
          <div className="query-results-header">
            <h3>Results</h3>
            <div className="query-stats">
              <span>{resultCount} row{resultCount !== 1 ? 's' : ''}</span>
              {executionTime && <span>Execution time: {executionTime}ms</span>}
            </div>
          </div>
          
          <div className="results-table-container">
            <table className="results-table">
              <thead>
                <tr>
                  {Object.keys(results[0]).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.keys(row).map(key => (
                      <td key={`${rowIndex}-${key}`}>
                        {row[key] !== null ? 
                          (typeof row[key] === 'object' ? JSON.stringify(row[key]) : row[key]) 
                          : 'NULL'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {results.length === 0 && !isLoading && !error && (
        <div className="query-no-results">
          <p>No results found.</p>
        </div>
      )}
    </div>
  );
};

export default QueryInterface;