import { Client } from 'pg';

const client = new Client({
    user: 'postgres',
    password: 'Techna12!',
    host: 'localhost',
    port: 5432,
    database: 'uveeme',
});

client.connect();

export default client;