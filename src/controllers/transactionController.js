const pool = require('../database');
const { v4: uuidv4 } = require('uuid');


const createTransaction = async (req, res) => {
  try {
    const { amount, currency, payment_method, description, customer } = req.body;

    if (!amount || !currency || !payment_method || !customer || !customer.name || !customer.email) {
      return res.status(400).json({ error: 'Dados inválidos. Verifique o payload enviado.' });
    }

    const transaction_id = uuidv4();
    //tinha colocado criado antes so por teste
    const status = 'Pending';
    const created_at = new Date();

    const result = await pool.query(
      `INSERT INTO transactions (transaction_id, amount, currency, payment_method, description, customer_name, customer_email, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [transaction_id, amount, currency, payment_method, description, customer.name, customer.email, status, created_at]
    );

    return res.status(201).json({
      transaction_id: result.rows[0].transaction_id,
      status: result.rows[0].status,
      created_at: result.rows[0].created_at,
    });

  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return res.status(500).json({ error: 'Erro interno ao processar a transação.' });
  }
};

const getTransactionById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const result = await pool.query(
        `SELECT * FROM transactions WHERE transaction_id = $1`,
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }
  
      return res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao buscar transação:', error);
      return res.status(500).json({ error: 'Erro interno ao buscar transação.' });
    }
  };
  const refundTransaction = async (req, res) => {
    try {
      const { id } = req.params;
  
      
      const result = await pool.query(
        `SELECT * FROM transactions WHERE transaction_id = $1`,
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }
  
      
      const refunded_at = new Date();
      await pool.query(
        `UPDATE transactions SET status = 'REFUNDED', updated_at = $1 WHERE transaction_id = $2`,
        [refunded_at, id]
      );
  
      return res.json({
        transaction_id: id,
        status: "REFUNDED",
        refunded_at
      });
  
    } catch (error) {
      console.error('Erro ao processar estorno:', error);
      return res.status(500).json({ error: 'Erro interno ao processar estorno.' });
    }
  };

  const webhookHandler = async (req, res) => {
    try {
      const { transaction_id, status } = req.body;
  
      if (!transaction_id || !status) {
        return res.status(400).json({ error: 'Dados inválidos no webhook' });
      }
  
      // Atualiza o status da transação no banco de dados
      const updated_at = new Date();
      const result = await pool.query(
        `UPDATE transactions SET status = $1, updated_at = $2 WHERE transaction_id = $3 RETURNING *`,
        [status, updated_at, transaction_id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }
  
      return res.json({ message: 'Webhook processado com sucesso', transaction: result.rows[0] });
  
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      return res.status(500).json({ error: 'Erro interno ao processar webhook' });
    }
  };

 module.exports = { createTransaction, getTransactionById, refundTransaction, webhookHandler };

