const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  // implement registration
  res.status(501).json({ message: 'Not implemented' });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  // implement login
  res.status(501).json({ message: 'Not implemented' });
});

module.exports = router;
