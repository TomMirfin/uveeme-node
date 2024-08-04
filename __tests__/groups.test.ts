import request from 'supertest';
import groupsRoutes from '../src/routes/groups';
import express from 'express';
import database from '../src/database';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/groups', groupsRoutes);


describe('Groups API', () => {


    it('should fetch all groups', async () => {
        const response = await request(app).get('/groups');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    }, 10000); // 10 seconds timeout


    it('should fetch a group by ID', async () => {
        const testGroupId = '550e8400-e29b-41d4-a716-446655440000';
        const response = await request(app).get(`/groups/${testGroupId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ "description": "This is a description of Team Alpha.", "groupImage": "http://example.com/team-alpha.jpg", "id": "550e8400-e29b-41d4-a716-446655440000", "lastEvent": "2024-07-31T23:00:00.000Z", "memberTypes": ["Admin", "Member", "Member"], "membersIds": [1, 2, 3], "membersNames": ["Alice", "Bob", "Charlie"], "name": "Team Alpha", "nextEvent": "2024-12-01T00:00:00.000Z", "scoreByMember": { "Alice": 80, "Bob": 75, "Charlie": 90 }, "totalScore": 250 }]);
    });

    it('should create a new group', async () => {
        const newGroup = {
            name: 'Team on the tester',
            description: 'This is a description of Team Alpha.',
        };

        const response = await request(app)
            .post('/groups')
            .send(newGroup)
            .set('Content-Type', 'application/json');

        // Assertions
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('insertId');
    });

    // it('should update a group by ID', async () => {
    //     const updatedGroup = {
    //         name: 'Team Beta Updated',
    //         groupImage: 'http://example.com/team-beta-updated.jpg'
    //     };

    //     const response = await request(app).put(`/groups/${testGroupId}`).send(updatedGroup);
    //     expect(response.status).toBe(200);
    //     expect(response.body.affectedRows).toBe(1); // Assuming API returns affected rows
    // });

    it('should delete a group by ID', async () => {
        const testGroupId = '550e8400-e29b-41d4-a716-44665544234';
        const response = await request(app).delete(`/groups/${testGroupId}`);
        expect(response.status).toBe(204);

    });

    // it('should add a user to a group', async () => {
    //     const newUser = {
    //         groupId: testGroupId,
    //         userId: '550e8400-e29b-41d4-a716-446655440001',
    //         name: 'John Doe'
    //     };

    //     const response = await request(app).post(`/groups/${testGroupId}/users`).send(newUser);
    //     expect(response.status).toBe(201);
    //     expect(response.body.affectedRows).toBe(1); // Assuming API returns affected rows
    // });
});
