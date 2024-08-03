
import mySql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
const pool = mySql.createPool({
    database: process.env.mysqlDB,
    host: process.env.mysqlHost,
    user: process.env.mysqlUser,
    password: process.env.mysqlPassword,
})

export default pool.promise();