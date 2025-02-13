// src/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

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