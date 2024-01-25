import { Router } from "express";
import passport from 'passport'
import { createHash, isValidPassword } from "../../utils.js";
import userModel from "../../models/user.model.js";
import cartModel from '../../models/cart.model.js'
import UserDTO from "../../dto/user.dto.js";
import emailService from '../../service/mails.service.js'
import jwt from 'jsonwebtoken';
import config from "../../config.js";

const router = Router();

router.post('/sessions', passport.authenticate('register', { failureRedirect: '/register' }) ,async (req,res)=>{
    req.logger.info('Inicio de sesion correctamente')
    res.redirect('/login')
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/login' }), async (req, res) => {
    try {
        req.session.user = req.user;
        const userId = req.session.user._id;
        const existingCart = await cartModel.findOne({ user: userId })
        if (!existingCart) {
            const newCart = new cartModel({ user: userId, items: [] });
            await newCart.save();
            console.log('¡Se ha creado un nuevo carrito para el usuario!');
        }
        req.logger.info('Inicio de sesion correctamente')
        res.redirect('/api/products');
    } catch (error) {
        req.logger.warning('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
});


router.get('/session/github', passport.authenticate('github', {scope: ['user.email']}  ))

router.get('/api/session/github-callback', passport.authenticate('github',{failureRedirect:'/login'}), (req,res)=>{
    req.logger.info('req.user ingresado: ', req.user);
    req.session.user = req.user;
    res.redirect('/api/products')
})

router.post('/recovery', async (req,res)=>{
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if(!user){
        return res.status(401).send('Correo o contraseña invalido')
    }
    await userModel.updateOne({email},{$set: {password:createHash(password)} })
    res.redirect('/login')
})

router.get('/logout', (req,res) =>{
    req.session.destroy((error)=>{
        res.redirect('/login')
    })
})

const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'No hay sesión activa' });
    }
    next();
};


router.get('/api/session/current', requireAuth, async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: 'No hay sesión activa' });
      }
      const user = await userModel.findById(req.session.user._id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      const userData = new UserDTO(user.toObject());  
      req.logger.info('Inicio de sesion correctamente')
      res.status(200).render('current', { user: userData });
    } catch (error) {
      req.logger.fatal('Error al obtener información de sesión:', error);
      res.status(500).json({ error: 'Error al obtener información de sesión' });
    }
  });

router.get('/forgot-password', async (req,res)=>{
    try {
        res.render('recoveryPassword')
    } catch (error) {
        req.logger.fatal('Error al obtener pagina recoveryPassword.handlebars', error);
    }
})

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const token = jwt.sign({ email }, config.jwt_token , { expiresIn: '1h' });
        await emailService.sendPasswordResetEmail(email, token);
        res.status(200).json('Link correctamente enviado al correo cargado.')
    } catch (error) {
        res.status(500).json({ message: 'Error al enviar el correo de restablecimiento de contraseña' });
    }
});

router.get('/reset-password', (req, res) => {
    try {
        const resetToken = req.query.token;
        console.log('resettoken for get', resetToken);
        if (!resetToken) {
            return res.redirect('/forgot-password');
        }
        res.render('resetPassword', { resetToken });
    } catch (error) {
        req.logger.fatal('Error al obtener pagina resetPassword.handlebars', error);
    }
});

router.post('/reset-password', async (req, res) => {
    const { newPassword, resetToken } = req.body;
    try {
        const decoded = jwt.verify(resetToken, config.jwt_token );
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        if (isValidPassword(newPassword, user)) {
            return res.status(400).json({ message: 'La nueva contraseña debe ser diferente a la actual, volver atras e ingresar una no usada anteriormente' });
        }
        const hashedPassword = createHash(newPassword);
        await userModel.updateOne({ email: decoded.email }, { $set: { password: hashedPassword } });

        res.status(200).redirect('/login');
    } catch (error) {
        res.status(400).json({ message: 'Token no válido o expirado' });
    }
});

router.get('/api/user/premium/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUser = req.session.user;
        if (currentUser.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Acceso no autorizado' });
        }
        const userToUpdate = await userModel.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const newRole = userToUpdate.role === 'usuario' ? 'premium' : 'usuario';
        await userModel.findByIdAndUpdate(userId, { role: newRole });

        res.status(200).json({ message: 'Rol de usuario actualizado correctamente' });
    } catch (error) {
        req.logger.error('Error al actualizar el rol del usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
    }
});



export default router