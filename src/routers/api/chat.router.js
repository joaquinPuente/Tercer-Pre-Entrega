import express from 'express';
import Message from '../../dao/models/chat.model.js';

const router = express.Router();

const userRoleAuth = (req, res, next) => {
    const { role } = req.session.user;
    if (role === 'usuario') {
      next();
    } else {
      res.status(403).json({ message: 'Acceso no autorizado. Se requiere rol de usuario' });
    }
  };

router.get('/chat', userRoleAuth, async (req, res) => {
    const messages = await Message.find().exec();
    res.render('chat', { messages: messages.map(p =>p.toJSON())});
});

export default router;