# Hopy Split Middleware API

## 📌 Visão Geral
Esta API foi desenvolvida para integrar uma adquirente sistema da Hopy Split, utilizando um middleware de pagamentos.
Ela permite a criação, consulta e estorno de transações.

## 🚀 Tecnologias Utilizadas
- **Node.js** + Express
- **PostgreSQL**
- **HTTPS** com certificados SSL

## 📂 Estrutura do Projeto
```
Hopy_Split/
│-- src/
│   ├── controllers/
│   │   ├── transactionController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   ├── routes/
│   │   ├── transactionRoutes.js
│   ├── ssl/
│   │   ├── server.crt
│   │   ├── server.key
│   ├── database.js
│   ├── server.js
│-- .env
│-- package.json
│-- README.md
```

## 📜 Configuração Inicial

### 🔹 **1. Clonar o repositório**
```sh
git clone https://github.com/seu-usuario/Hopy_Split.git
cd Hopy_Split
```

### 🔹 **2. Instalar dependências**
```sh
npm install
```

### 🔹 **3. Configurar o Banco de Dados**
Crie as tabelas necessárias no PostgreSQL:
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(50) UNIQUE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  description TEXT,
  customer_name VARCHAR(100),
  customer_email VARCHAR(100),
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(50) REFERENCES transactions(transaction_id),
  event_type VARCHAR(50),
  event_payload JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 🔹 **4. Criar o arquivo `.env`**
Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente:
```env
PORT=3000
DATABASE_URL=postgres://fulvius:5160@45.32.213.25:5432/hopy_middleware
SSL_KEY_PATH=src/ssl/server.key
SSL_CERT_PATH=src/ssl/server.crt
API_KEY=sua_chave_api_aqui
```

### 🔹 **5. Iniciar o servidor**
```sh
node src/server.js
```
## 📡 Endpoints Disponíveis

### 📝 **1. Criar uma Transação**
- **URL:** `POST /transactions`
- **Corpo da Requisição:**
```json
{
  "amount": 150.00,
  "currency": "BRL",
  "payment_method": "credit_card",
  "description": "Serviço de assinatura",
  "customer": {
    "name": "Fulvius Macedo",
    "email": "fulviusmacedo@email.com"
  }
}
```
- **Resposta:**
```json
{
  "transaction_id": "123456",
  "status": "Pending",
  "created_at": "2025-02-11T15:29:34Z"
}
```

### 🔍 **2. Consultar uma Transação**
- **URL:** `GET /transactions/:id`
- **Resposta:**
```json
{
  "transaction_id": "123456",
  "amount": 150.00,
  "currency": "BRL",
  "status": "PAID",
  "customer": {
    "name": "Fulvius macedo",
    "email": "fulviusmacedo@email.com"
  },
  "created_at": "2025-02-11T15:29:34Z",
  "updated_at": "2025-02-11T16:00:00Z"
}
```

### 🔄 **3. Estornar uma Transação**
- **URL:** `POST /transactions/:id/refund`
- **Resposta:**
```json
{
  "transaction_id": "123456",
  "status": "REFUNDED",
  "refunded_at": "2025-02-11T17:00:00Z"
}
```

### 📩 **4. Receber Webhooks**
- **URL:** `POST /webhooks/hopysplit`
- **Descrição:** Esse endpoint recebe notificações sobre mudanças de status de transações.
- **Exemplo de Payload:**
```json
{
  "transaction_id": "123456",
  "event": "PAYMENT_CONFIRMED",
  "timestamp": "2025-02-11T16:30:00Z"
}
```

---

## 🔒 Segurança e Autenticação
Para garantir que apenas chamadas autorizadas sejam processadas:
- **Use um token de API** (exemplo: `API_KEY` no `.env`).
- **Valide a origem dos webhooks** antes de processar qualquer evento.

## 🚀 Como Testar
Teste os endpoints usando **cURL**:
```sh
curl -k -X POST https://45.32.213.25:3443/api/transactions \
  -H "Content-Type: application/json" \
  -H "x-api-key: c504dccb93b2996f7e65f3c5ac5651c65ab665e508463f64da642c23f4e85044" \
  -d '{
    "amount": 150.00,
    "currency": "BRL",
    "payment_method": "credit_card",
    "description": "Teste de transação",
    "customer": {
      "name": "Fulvius Macedo",
      "email": "fulvius@macedo.com"
    }
  }'
```
```sh
curl -k -X GET https://45.32.213.25:3443/api/transactions/079c9f25-be89-47db-b26a-d531d8a5a9f4 \
     -H "x-api-key: c504dccb93b2996f7e65f3c5ac5651c65ab665e508463f64da642c23f4e85044"
```
```sh
curl -k -X POST https://45.32.213.25:3443/api/transactions/079c9f25-be89-47db-b26a-d531d8a5a9f4/refund \
     -H "Content-Type: application/json" \
     -H "x-api-key: c504dccb93b2996f7e65f3c5ac5651c65ab665e508463f64da642c23f4e85044"
```
```sh
curl -k -X POST https://45.32.213.25:3443/api/webhooks/hopysplit \
     -H "Content-Type: application/json" \
     -H "x-api-key: c504dccb93b2996f7e65f3c5ac5651c65ab665e508463f64da642c23f4e85044" \
     -d '{
           "transaction_id": "079c9f25-be89-47db-b26a-d531d8a5a9f4",
           "event": "payment_confirmed",
           "status": "PAID"
         }'
```
