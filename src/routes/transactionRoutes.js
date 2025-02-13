const express = require('express');
const { createTransaction, getTransactionById, refundTransaction, webhookHandler  } = require('../controllers/transactionController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/transactions', authenticate,createTransaction);
router.get('/transactions/:id',authenticate, getTransactionById);
router.post('/transactions/:id/refund',authenticate, refundTransaction);
router.post('/webhooks/hopysplit', webhookHandler);

module.exports = router;
