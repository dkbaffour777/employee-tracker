const mysql = require('mysql2');
 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db'
}, console.log('connected to employee_db database'));

module.exports = connection;