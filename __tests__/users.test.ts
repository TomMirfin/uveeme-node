import request from 'supertest';
import express from 'express';
import usersRoutes from '../src/routes/users';



const app = express();
app.use(express.json());
app.use('/users', usersRoutes);

describe.skip('Users API', () => {


    it('should fetch all users', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

    });

    it('should fetch a user by ID', async () => {

        const userId = "123e4567-e89b-12d3-a456-426614174000";
        const response = await request(app).get(`/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ "associatedGroupNames": ["Group Alpha", "Group Beta"], "associatedGroupsId": ["123e4567-e89b-12d3-a456-426614174000", "123e4567-e89b-12d3-a456-426614174001"], "createdOn": "2023-01-01T00:00:00.000Z", "dob": "1990-01-01T00:00:00.000Z", "email": "john.doe@example.com", "id": "123e4567-e89b-12d3-a456-426614174000", "name": "John Doe", "phoneNumber": "1234567890", "profilePictureUrl": "https://example.com/images/john_doe.png", "updatedOn": "2023-09-30T23:00:00.000Z" }]); // Assuming your user object has an ID property

    });

    it('should create a new user', async () => {
        const newUser = {
            name: 'John',
            email: 'Jodi@example.com',
            profilePictureUrl: 'http://example.com/john.jpg',
            dob: new Date('1990-01-01').toISOString().split('T')[0],
            phoneNumber: '1234567890',
            updatedOn: new Date().toISOString().split('T')[0],
            associatedGroupNames: ['Group A', 'Group B'],
            associatedGroupId: [1, 2]
        };


        const response = await request(app).post('/users').send(newUser);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('insertId');

    });

    it('should update an existing user', async () => {

        const userId = "123e4567-e89b-12d3-a456-426614174001";
        const updatedUser = {
            name: 'Tom Mirfin',
            email: 'Tom.Mirfin@example.com',
            profilePictureUrl: 'http://example.com/john.jpg',
            dob: new Date('1990-01-01').toISOString().split('T')[0],
            createdOn: new Date().toISOString().split('T')[0],
            phoneNumber: '1234567890',
            updatedOn: new Date().toISOString().split('T')[0],
            associatedGroupNames: ['Group A', 'Group B'],
            associatedGroupId: [1, 2]
        };


        const response = await request(app).put(`/users/${userId}/change`).send(updatedUser);
        expect(response.status).toBe(200);

    });

    it('should delete a user', async () => {
        const userId = "123e4567-e89b-12d3-a456-426614174001";
        const response = await request(app).delete(`/users/${userId}`);
        expect(response.status).toBe(204);
    });


});
