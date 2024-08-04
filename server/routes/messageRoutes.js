const express = require('express');
const Message = require('../models/messageModel');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Get all messages
router.get('/', authMiddleware, async (req, res) => {
  const messages = await Message.find({});
  res.json(messages);
});

module.exports = router;
