const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv').config();

const app = express()
const port = 443
app.use(cors());

const dbpassword = process.env.PASSWORD;
const dbdatabase = process.env.DATABASE

// Set up MySQL connection

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: dbpassword,
    database: dbdatabase,
});

// Connect to the database

db.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      process.exit(1);
    } else {
      console.log("Connected to the database.");
    }
});

// Fetch data from the database

app.get('/data', (req, res) => {
    const { dro_code } = req.query
    console.log(`Received request for DRO Code: ${dro_code}`);
    if (!dro_code) {
        return res.status(400).json({ error: 'dro_code is required'});
    }
    const query = `SELECT * FROM offshore.dro_pcf_income WHERE dro_code = ${dro_code}`;
    console.log(`Executing query: ${query}`);
    db.query(query, [dro_code], (err, results) => {
        if (err) throw err;
        console.log(`Results for DRO Code ${dro_code}:`, results);
        res.json(results);
    });
});

// Start the server

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});