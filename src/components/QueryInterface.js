import React, { useState, useEffect } from 'react';
import { executeQuery } from '../services/db';
import { syncData } from '../services/syncService';

const QueryInterface = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
    };

    const handleQuerySubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await executeQuery(query);
            setResults(data);
            syncData();
        } catch (err) {
            setError('Error executing query: ' + err.message);
        }
    };

    useEffect(() => {
        const handleStorageChange = () => {
            // Logic to refresh results if data changes in other tabs
            const fetchData = async () => {
                const data = await executeQuery(query);
                setResults(data);
            };
            fetchData();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [query]);

    return (
        <div>
            <h2>Query Patient Records</h2>
            <form onSubmit={handleQuerySubmit}>
                <textarea
                    value={query}
                    onChange={handleQueryChange}
                    placeholder="Enter your SQL query here"
                    rows="4"
                    cols="50"
                />
                <button type="submit">Execute Query</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h3>Results:</h3>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>{JSON.stringify(result)}</li>
                ))}
            </ul>
        </div>
    );
};

export default QueryInterface;