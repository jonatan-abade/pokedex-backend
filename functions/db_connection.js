import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
const connection = mysql.createConnection({
    
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

connection.connect(function(err) {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});

export {connection};

