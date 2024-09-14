
import mySql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
const pool = mySql.createPool({
    database: 'uveeme',
    host: 'uveeme-db.chu6s8eo478x.eu-west-1.rds.amazonaws.com',
    user: 'admin',
    password: 'CM7CmTWDwSWPMonWs89n',
})




export default pool;