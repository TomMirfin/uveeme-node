import request from 'supertest';
import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
describe.skip('Update Scores API', () => {
    let eventId: string;

    beforeAll(async () => {
        // Create an event to use for testing
        const newEvent = {
            name: 'Test Event',
            description: 'This is a test event.',
            groupId: '550e8400-e29b-41d4-a716-446655440000',
            location: '123 Test St, Testville, TX',
            startDate: '2024-07-31T23:00:00.000Z',
            endDate: '2024-12-01T00:00:00.000Z',
            attendees: ['Alice', 'Bob'],
            scoreByMember: [],
        };

        const createResponse = await request(app)
            .post('/events')
            .send(newEvent)
            .set('Content-Type', 'application/json');

        // Extract the event ID from the response
        eventId = createResponse.body.id;
    });

    it('should update scores for an event', async () => {
        const updateData = {
            eventId: eventId,
            memberId: '5345435345',
            score: 95
        };

        const response = await request(app)
            .post('/update-scores') // Adjust to the correct endpoint
            .send(updateData)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Scores updated successfully');

        // Verify the scores are updated in the database
        const eventResponse = await request(app).get(`/events/${eventId}`);
        const updatedEvent = eventResponse.body;
        expect(updatedEvent.scoreByMember).toContainEqual({
            memberId: '5345435345',
            score: 95
        });
    });
});
