const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
app.use(cors());
const app = express();

app.use(express.json());

// Pool korzystający ze zmiennej środowiskowej DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Endpoint do sprawdzania klucza
app.post('/api/check-key', async (req, res) => {
  const { key } = req.body;
  if (!key) return res.status(400).json({ success: false, message: 'No key provided' });

  try {
    const result = await pool.query('SELECT * FROM keys WHERE "key" = $1', [key]);
    if (result.rows.length > 0) {
      res.json({ success: true, message: 'Access granted. Welcome!' });
    } else {
      res.json({ success: false, message: 'Wrong key!' });
    }
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Prosty middleware do autoryzacji dodawania kluczy (np. z tokenem)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'secret-token';

function adminAuth(req, res, next) {
  const token = req.headers['authorization'];
  if (token === `Bearer ${ADMIN_TOKEN}`) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden' });
  }
}

// Endpoint do dodawania nowego klucza (z autoryzacją)
app.post('/api/add-key', adminAuth, async (req, res) => {
  const { key, sold_to } = req.body;
  if (!key) return res.status(400).json({ success: false, message: 'No key provided' });

  try {
    await pool.query('INSERT INTO keys("key", sold_to, created_at) VALUES ($1, $2, NOW())', [key, sold_to || null]);
    res.json({ success: true, message: 'Key added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
