"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const client = new pg_1.Client({
    user: 'postgres',
    password: 'Techna12!',
    host: 'localhost',
    port: 5432,
    database: 'uveeme',
});
client.connect();
exports.default = client;
