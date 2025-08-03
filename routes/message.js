const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// POST /api/messages → send a new message
router.post('/', async (req, res) => {
  const { sender, receiver, message } = req.body;

  try {
    const newMessage = await Message.create({ sender, receiver, message });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/messages/:user1Id/:user2Id → fetch chat between two users
router.get('/:user1Id/:user2Id', async (req, res) => {
  const { user1Id, user2Id } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1Id, receiver: user2Id },
        { sender: user2Id, receiver: user1Id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
