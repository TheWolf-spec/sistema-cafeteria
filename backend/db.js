const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'cafeteria_db', 
    password: 'as', 
    port: 5432, 
});


module.exports = pool;