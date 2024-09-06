const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config('../.env');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');

    const firstname = 'Warner';
    const lastname = 'James';
    const email = 'warner.james@acteion.com';
    const phone = '5124562589';
    const message = 'Hello, this is a test message. Inserting from Node JS.';

    const sql = `
        INSERT INTO customers (firstname, lastname, email, phone, message)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            firstname = VALUES(firstname),
            lastname = VALUES(lastname),
            phone = VALUES(phone),
            message = VALUES(message);
    `;

    db.query(sql, [firstname, lastname, email, phone, message], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return;
        }
        console.log('Data inserted successfully:', result);

        // Fetch data from the database after inserting
        const fetchSql = 'SELECT * FROM customers';
        db.query(fetchSql, (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return;
            }
            // Print the fetched data to the console
            console.log('Fetched data from MySQL: ', results);
        });
    });
});

// Route to handle form submission
app.post('/submit', async (req, res) => {
    const { firstname, lastname, email, phone, message } = req.body;
    const sql = `
        INSERT INTO customers (firstname, lastname, email, phone, message)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            firstname = VALUES(firstname),
            lastname = VALUES(lastname),
            phone = VALUES(phone),
            message = VALUES(message);
    `;

    db.query(sql, [firstname, lastname, email, phone, message], async (err, result) => {
        if (err) {
            console.error('Error saving data:', err);
            return res.status(500).send(err);
        }
        res.send('Contact saved successfully.');
    });
});

// Route to fetch all contacts
app.get('/contacts', (req, res) => {
    const sql = 'SELECT * FROM customers';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send(err);
        }
        // Print the data to the console
        console.log('Fetched data from MySQL: ', results);
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
