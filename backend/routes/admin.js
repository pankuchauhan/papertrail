const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');

// Admin routes placeholder
router.get('/stats', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

module.exports = router;
