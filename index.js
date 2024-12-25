const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors()); 
app.use(bodyParser.json());
const pool = mysql.createPool({
    host: 'localhost',     //host
    port: 3307,
    user: 'root',          //username
    password: '123456',    // password
    database: 'srmiggy_students', //database name
    waitForConnections: true, 
    connectionLimit: 10,   
    queueLimit: 0       
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
    connection.release(); 
});
app.post('/signin', (req, res) => {
    const { netid, password } = req.body;
    if (!netid || !password) {
        return res.status(400).json({ message: 'Net ID and password are required' });
    }
    const query = `SELECT * FROM students WHERE netid = ? AND password = ?`;
    pool.query(query, [netid, password], (err, results) => {
        if (err) {
            console.error('Database query error: ', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.length > 0) {
            res.status(200).json({ message: 'Signed in successfully!' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
