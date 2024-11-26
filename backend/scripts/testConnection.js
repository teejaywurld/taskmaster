require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
    try {
        console.log('\nTesting MongoDB Connection:');
        console.log('-------------------------');
        console.log('MONGODB_URI:', process.env.MONGODB_URI || 'Not defined');

        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✓ Connection successful!');
        console.log('Connected to database:', mongoose.connection.name);
        
        await mongoose.connection.close();
        console.log('Connection closed successfully');
        process.exit(0);
    } catch (error) {
        console.error('× Connection failed:', error.message);
        process.exit(1);
    }
};

testConnection();
