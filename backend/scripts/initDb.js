require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

const initializeDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Task.deleteMany({});
        console.log('Cleared existing data');

        // Create test user
        const testUser = new User({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        await testUser.save();
        console.log('Created test user');

        // Create sample tasks
        const tasks = [
            {
                title: 'Sample Task 1',
                description: 'This is a sample task',
                deadline: new Date(),
                priority: 'high',
                user: testUser._id
            },
            {
                title: 'Sample Task 2',
                description: 'This is another sample task',
                deadline: new Date(),
                priority: 'medium',
                user: testUser._id
            }
        ];

        await Task.insertMany(tasks);
        console.log('Created sample tasks');

        console.log('Database initialization completed');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

initializeDatabase();
