const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders
router.post('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

module.exports = router;
