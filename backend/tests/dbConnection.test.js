require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

describe('Database Connection', () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should connect to MongoDB', () => {
        expect(mongoose.connection.readyState).toBe(1);
    });
});
