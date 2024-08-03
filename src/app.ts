import express from 'express';
import usersRoutes from './routes/users';
import groupsRoutes from './routes/groups';
import db from './database';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
// Middleware to parse JSON bodies
app.use(express.json());
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.json());
app.use('/users', usersRoutes);
app.use('/groups', groupsRoutes);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});




// Properly close the database connection when needed
process.on('SIGINT', () => {
    db.end().then(() => {
        console.log('Database connection closed.');
        process.exit(0);
    }).catch(err => {
        console.error('Error closing the database connection:', err);
        process.exit(1);
    });
});

export default app;