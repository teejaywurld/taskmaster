require('dotenv').config();
const mongoose = require('mongoose');
const fetch = require('node-fetch');

const testSetup = async () => {
    console.log('\nTesting Application Setup:');
    console.log('------------------------');

    // Test MongoDB Connection
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ MongoDB Connection: Success');
        await mongoose.connection.close();
    } catch (error) {
        console.log('× MongoDB Connection: Failed');
        console.error(error.message);
    }

    // Test Backend Server
    try {
        const response = await fetch('http://localhost:3000/api/test');
        const data = await response.json();
        console.log('✓ Backend Server: Running');
        console.log('Response:', data.message);
    } catch (error) {
        console.log('× Backend Server: Not Running');
        console.error('Make sure to start the server with: npm run server');
    }

    // Test Frontend Server
    try {
        const response = await fetch('http://localhost:3001');
        console.log('✓ Frontend Server: Running');
    } catch (error) {
        console.log('× Frontend Server: Not Running');
        console.error('Make sure to start the client with: npm run client');
    }
};

testSetup();
