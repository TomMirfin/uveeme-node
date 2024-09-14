import request from 'supertest';
import invitesRoutes from '../src/routes/groups';
import express from 'express';
import database from '../src/database';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/invites', invitesRoutes);

afterAll(async () => {
    // Clean up database and close connection
    await database.end();
});

describe.skip('Invites API', () => {
    it('should fetch all invites', async () => {
        const response = await request(app).get('/invites');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    }, 10000); // 10 seconds timeout

    it('should fetch an invite by ID', async () => {
        const testInviteId = '550e8400-e29b-41d4-a716-446655440000';
        const response = await request(app).get(`/invites/${testInviteId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ "description": "This is a description of Team Alpha.", "groupImage": "http://example.com/team-alpha.jpg", "id": "550e8400-e29b-41d4-a716-446655440000", "lastEvent": "2024-07-31T23:00:00.000Z", "memberTypes": ["Admin", "Member", "Member"], "membersIds": [1, 2, 3], "membersNames": ["Alice", "Bob", "Charlie"], "name": "Team Alpha", "nextEvent": "2024-12-01T00:00:00.000Z", "scoreByMember": { "Alice": 80, "Bob": 75, "Charlie": 90 }, "totalScore": 250 }]);
    });

    it.only('should create a new invite', async () => {

        const newInvite = {
            inviter: '121d186f-0303-4e58-9d73-fccdbb13ad5a',
            invitee: '123e4567-e89b-12d3-a456-426614174000',
            groupId: '123e4567-e89b-12d3-a456-426614174000',
        };

        const response = await request(app)
            .post('/invites')
            .send(newInvite)
            .set('Content-Type', 'application/json');

        // Assertions
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('insertId');
    });

    it('should update an invite by ID', async () => {
        const testInviteId = "550e8400-e29b-41d4-a716-446655440000"
        const updatedInvite = {
            name: 'Team Beta Updated two',
        };

        const response = await request(app).patch(`/invites/${testInviteId}`).send(updatedInvite);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty([{ "affectedRows": 1 }]);
    })

    // it('should accept an invited user', async () => {
    //     const testInviteId = "550e8400-e29b-41d4-a716-446655440000"
    //     const response = await request(app).post(`/invites/${testInviteId}/accept`).then((res) => {
    //         database.query('SELECT * FROM groups WHERE id = ?', [userId]).then((rows) => {
    //             expect(rows[0].membersIds).toContain(userId);
    //             expect(response.status).toBe(200);
    //         });


    //     })
    // })
});