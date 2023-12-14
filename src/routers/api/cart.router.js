import { Router } from "express";
import mongoose from "mongoose";
import cartModel from "../../models/cart.model.js";

const router = Router();

// Vista para visualizar los carritos desde el navegador
router.get('/carts', async (req,res)=>{
    const carritos = await cartModel.find();
    res.render('cart', {carritos: carritos.map(p =>p.toJSON())});
});


//Ruta para borrar los carritos desde el navegador
router.post('/removeFromCart', async (req, res) => {
    
});

//Ruta para agregar productos a los carritos desde el navegador
router.post('/addToCart', async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.session.user._id; // Obtener el ID del usuario de la sesión

        // Encontrar el carrito del usuario o crear uno si no existe
        let userCart = await cartModel.findOne({ user: userId });
        if (!userCart) {
            userCart = new cartModel({ user: userId, items: [] });
        }

        // Agregar el producto al carrito del usuario
        userCart.items.push({ product: productId, quantity: 1 });
        await userCart.save();

        res.redirect('/api/products');
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).send('Error al agregar al carrito');
    }
});


export default router;