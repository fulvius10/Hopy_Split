const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Conectado ao PostgreSQL com sucesso!');
});

pool.on('error', (err) => {
  console.error('Erro no pool do PostgreSQL:', err);
});

module.exports = pool;
