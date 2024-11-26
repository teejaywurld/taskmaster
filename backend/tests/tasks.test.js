const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Task = require('../models/Task');
const User = require('../models/User');

let mongoServer;
let authToken;
let userId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create test user and get auth token
    const response = await request(app)
        .post('/api/auth/register')
        .send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });

    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'test@example.com',
            password: 'password123'
        });

    authToken = loginResponse.body.token;
    userId = loginResponse.body.user.id;
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Task.deleteMany({});
});

describe('Task Tests', () => {
    const testTask = {
        title: 'Test Task',
        description: 'Test Description',
        deadline: new Date().toISOString(),
        priority: 'medium'
    };

    describe('POST /api/tasks', () => {
        it('should create a new task', async () => {
            const response = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testTask);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('title', testTask.title);
            expect(response.body).toHaveProperty('user', userId);
        });

        it('should not create task without authentication', async () => {
            const response = await request(app)
                .post('/api/tasks')
                .send(testTask);

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/tasks', () => {
        beforeEach(async () => {
            await Task.create({ ...testTask, user: userId });
        });

        it('should get all tasks for authenticated user', async () => {
            const response = await request(app)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty('title', testTask.title);
        });

        it('should filter tasks by priority', async () => {
            const response = await request(app)
                .get('/api/tasks?priority=medium')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
        });
    });
});
