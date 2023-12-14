import { Router } from "express";
import passport from 'passport'
import { createHash, isValidPassword } from "../../utils.js";
import userModel from "../../models/user.model.js";
import cartModel from '../../models/cart.model.js'

const router = Router();

router.post('/sessions', passport.authenticate('register', { failureRedirect: '/register' }) ,async (req,res)=>{
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

        res.redirect('/api/products');
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
});


router.get('/session/github', passport.authenticate('github', {scope: ['user.email']}  ))

router.get('/api/session/github-callback', passport.authenticate('github',{failureRedirect:'/login'}), (req,res)=>{
    console.log('req.user', req.user);
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
        const userData = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        console.log(userData);
        res.status(200).render('current', { user: userData });
    } catch (error) {
        console.error('Error al obtener información de sesión:', error);
        res.status(500).json({ error: 'Error al obtener información de sesión' });
    }
});

export default router