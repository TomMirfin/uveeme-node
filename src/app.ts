import express from 'express';
import usersRoutes from './routes/users';
import groupsRoutes from './routes/groups';
import db from './database';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import eventsRoutes from './routes/events';
import scoresRouter from './routes/scores';
import { Request } from "express";
import cors from "cors";


dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(bodyParser.json())
app.use(cors());
// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handlers
app.use('/users', usersRoutes);
app.use('/groups', groupsRoutes);
app.use('/events', eventsRoutes);
app.use('/scores', scoresRouter);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});




app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

// Properly close the database connection when needed
// process.on('SIGINT', () => {
//     db.end().then(() => {
//         console.log('Database connection closed.');
//         process.exit(0);
//     }).catch(err => {
//         console.error('Error closing the database connection:', err);
//         process.exit(1);
//     });
// });



export default app;
