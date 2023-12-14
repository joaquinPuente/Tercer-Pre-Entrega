import express from 'express';
import Message from '../../models/chat.model.js';

const router = express.Router();

router.get('/chat', async (req, res) => {
    const messages = await Message.find().exec();
    console.log('Mensajes:', messages)
    res.render('chat', { messages: messages.map(p =>p.toJSON())});
});

export default router;