// src/config/database.js

const mysql = require('mysql2/promise'); // <-- Verifique se tem o '/promise'
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// A linha abaixo é a mais importante!
// Ela garante que estamos exportando o objeto de conexão que tem a função .execute()
module.exports = pool;