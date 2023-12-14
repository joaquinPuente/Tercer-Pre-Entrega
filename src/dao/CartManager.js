import Cart from '../models/cart.model.js';

export default class CartManager {
    // Leer todos los carritos
    static async getCarts() {
        try {
            const carts = await Cart.find();
            return carts;
        } catch (error) {
            console.error('Error al obtener los carritos', error);
            throw error;
        }
    }

    // Crear un nuevo carrito
    static async createCart(cartNumber) {
        try {
            const newCart = await Cart.create({ cartNumber, products: [] });
            console.log('Carrito creado correctamente');
            return newCart;
        } catch (error) {
            console.error('Error al crear carrito', error.message);
            throw error;
        }
    }

    static async getCartByCartNumber(cartNumber) {
        try {
            const cart = await Cart.findOne({ cartNumber });
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito por número de carrito', error.message);
            throw error;
        }
    }

    // Agregar un producto a un carrito
    static async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('No se encontró el carrito');
            }
            // Comprueba si el producto ya existe en el carrito
            const existingProductIndex = cart.products.findIndex((product) => product.productId === productId);
            if (existingProductIndex !== -1) {
                // Si el producto ya existe, actualiza la cantidad
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                // Si el producto no existe, agrégalo al carrito
                cart.products.push({ productId, quantity });
            }
            await cart.save();
            console.log('Producto agregado al carrito');
            return cart;
        } catch (error) {
            console.error('Error al agregar producto al carrito', error.message);
            throw error;
        }
    }

    // Eliminar un item del carrito
    static async removeProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('No se encontró el carrito');
            }
            const productIndex = cart.products.findIndex(product => product.productId === productId);
            if (productIndex === -1) {
                throw new Error('No se encontró el producto en el carrito');
            }
            cart.products.splice(productIndex, 1);
            await cart.save();
            console.log('Producto eliminado del carrito');
            return cart;
        } catch (error) {
            console.error('Error al eliminar producto del carrito', error.message);
            throw error;
        }
    }
}