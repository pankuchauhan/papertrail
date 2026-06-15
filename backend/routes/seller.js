const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Seller routes placeholder
router.get('/my-books', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

module.exports = router;
