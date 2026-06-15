const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET /api/books
router.get('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// GET /api/books/:id
router.get('/:id', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// POST /api/books
router.post('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

module.exports = router;
