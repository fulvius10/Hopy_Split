// src/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const pool = require('./database');
const transactionRoutes = require('./routes/transactionRoutes');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', transactionRoutes);

app.get('/', (req, res) => {
  res.send('API está rodando em HTTPS!');
});

const key = fs.readFileSync(process.env.SSL_KEY_PATH);
const cert = fs.readFileSync(process.env.SSL_CERT_PATH);

const PORT = process.env.PORT || 3000;
const httpsServer = https.createServer({ key, cert }, app);

httpsServer.listen(PORT, () => {
  console.log(`Servidor HTTPS rodando na porta: ${PORT}`);
});

// Teste para verificar conexão com banco
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as now');
    res.json({ dbTime: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao conectar no banco' });
  }
});
//teste de erro rota
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`Rota carregada: ${r.route.path}`);
  }
});
