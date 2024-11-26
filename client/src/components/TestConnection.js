import React, { useState, useEffect } from 'react';

const TestConnection = () => {
    const [backendStatus, setBackendStatus] = useState('Testing...');
    const [mongoStatus, setMongoStatus] = useState('Testing...');

    useEffect(() => {
        // Test backend connection
        fetch('http://localhost:3000/api/test')
            .then(res => res.json())
            .then(data => {
                setBackendStatus('Connected! ' + data.message);
            })
            .catch(err => {
                setBackendStatus('Connection failed: ' + err.message);
            });

        // Test MongoDB connection through backend
        fetch('http://localhost:3000/api/auth/test-db')
            .then(res => res.json())
            .then(data => {
                setMongoStatus('Connected! Database is working');
            })
            .catch(err => {
                setMongoStatus('Database connection failed: ' + err.message);
            });
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Connection Test</h2>
            <div>
                <p>Backend Status: {backendStatus}</p>
                <p>Database Status: {mongoStatus}</p>
            </div>
        </div>
    );
};

export default TestConnection;
