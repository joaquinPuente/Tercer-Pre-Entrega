import { Router } from 'express';
import UsuarioController from '../../controllers/usuario.controller.js';

const router = Router();

router.get('/users', async (req, res) => {
    try {
        await UsuarioController.getAllUsers(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default router;