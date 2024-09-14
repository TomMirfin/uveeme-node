import request from 'supertest';
import eventroutes from '../src/routes/events';
import express from 'express';
import database from '../src/database';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/groups', eventroutes);

afterAll(async () => {
    // Clean up database and close connection
    await database.end();
});


describe('Events API', () => {

    it.only('should create a new event', async () => {
        const newEvent = {
            name: 'Event Name',
            description: 'This is a description of the event.',
            fromGroup: '550e8400-e29b-41d4-a716-446655440000',
            date: '2024-07-31T23:00:00.000Z',
            location: '123 Main St, Springfield, IL',
            attendees: ['Alice', 'Bob', 'Charlie'],
            admin: ['Alice'],
        };

        const response = await request(app)
            .post('/events')
            .send(newEvent)
            .set('Content-Type', 'application/json');

        // Assertions
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('insertId');
    });

});