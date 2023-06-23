const express = require('express');
const { Pool } = require('pg');
const app = express();
const cors = require('cors');

const pool = new Pool({
  user: 'postgres',
  password: 'AlphaBetaGamma12!',
  host: 'aqua-tech-interview-db-anshuman.cjdznkfiy2n7.us-east-1.rds.amazonaws.com',
  port: 5432,
  database: 'techInterview'
});

// I'm requesting from 3000 to 8000, so need to apply the CORS middleware
// By default, web browsers enforce the same-origin policy, which prevents web pages from making requests to a different domain, port, or protocol.
app.use(cors());

// set approproate headers to indicate if valid json or not
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

// root file path
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// file path to get data from joined tables:
app.get('/api/records', async (req, res) => {
    try {
      const records = await pool.query(`
        SELECT p.personid, p.first_name, p.last_name, p.age, p.ssn, a.addressid, a.address_street, a.address_city, a.address_state, a.address_zip
        FROM person AS p
        JOIN address AS a ON p.personid = a.personid
        LIMIT 30;
      `);
  
      res.json(records.rows);
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// get paginated records from joined tables:
app.get('/api/records/paginated', async (req, res) => {
  try {
    const { page, pageSize} = req.query;
    const offset = (parseInt(page) - 1) * parseInt(pageSize);

    const query = `
      SELECT p.personid, p.first_name, p.last_name, p.age, p.ssn, a.addressid, a.address_street, a.address_city, a.address_state, a.address_zip
      FROM person AS p
      JOIN address AS a ON p.personid = a.personid
      OFFSET $1
      LIMIT $2;
    `;

    const records = await pool.query(query, [offset, parseInt(pageSize)]);
    res.json(records.rows);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get the count of all records
app.get('/api/records/count', async (req, res) => {
  try {
    const query = 'SELECT COUNT(*) AS count FROM person';
    const result = await pool.query(query);
    const totalCount = result.rows[0].count;
    res.json({ count: totalCount });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// file path to search for matching records
app.get('/api/records/search', async (req, res) => {
  try {
    const { query } = req.query;

    const searchQuery = `
      SELECT p.personid, p.first_name, p.last_name, p.age, p.ssn, a.addressid, a.address_street, a.address_city, a.address_state, a.address_zip
      FROM person AS p
      JOIN address AS a ON p.personid = a.personid
      WHERE p.first_name ILIKE $1
         OR p.last_name ILIKE $1
         OR CAST(p.age AS TEXT) ILIKE $1
         OR a.address_street ILIKE $1
         OR a.address_city ILIKE $1
         OR a.address_state ILIKE $1
         OR a.address_zip ILIKE $1
      LIMIT 30;
    `;

    const records = await pool.query(searchQuery, [`%${query}%`]);
    res.json(records.rows);
  } catch (error) {
    console.error('Error searching records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// close the connection pool to release any resources when db is shut down:
process.on('beforeExit', () => {
  pool.end();
});

// listen for a port when running server:
const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});