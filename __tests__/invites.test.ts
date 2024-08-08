import request from 'supertest';
import invitesRoutes from '../src/routes/groups';
import express from 'express';
import database from '../src/database';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/groups', invitesRoutes);

afterAll(async () => {
    // Clean up database and close connection
    await database.end();
});