import RouterBase from "./RouterBase.js";
import cartModel from "../../models/cart.model.js";

export default class cartByRouterBase extends RouterBase {
  init() {
    this.get('/cart', ['PUBLIC'], async function(req, res) {
        try {
          const userId = req.session.user._id;
          const userCart = await cartModel.findOne({ user: userId }).populate('items.product');;
          if (!userCart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
          }
          console.log('userCart',userCart);
          const productsInCart = userCart.items.map(item => ({
            title: item.product.title,
            description: item.product.description,
            price: item.product.price,
            quantity: item.quantity,
            id: item.product._id
          }));
          console.log('inCart', productsInCart );
          res.render('cartDetails', { products: productsInCart });
        } catch (error) {
          console.error('Error al cargar el carrito', error.message);
          res.status(500).json({ error: 'Error al cargar el carrito' });
        }
    });
      
    //Ruta para borrar item del carrito desde el navegador
    this.post('/removeFromCart', ['PUBLIC'], async function (req, res) {
        try {
          const { productId } = req.body;
          const userId = req.session.user._id;
          const userCart = await cartModel.findOne({ user: userId });
          if (!userCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
          }
          const productIndex = userCart.items.findIndex(item => String(item.product) === productId);
          if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
          }
          userCart.items.splice(productIndex, 1);
          await userCart.save();
          console.log('Producto eliminado del carrito:', productId);
          res.redirect('/api/cart');
        } catch (error) {
          console.error('Error al eliminar el producto del carrito:', error.message);
          res.status(500).json({ error: error.message });
        }
      });

    // Ruta para agregar productos al carrito desde el navegador
    this.post('/addToCart', ['PUBLIC'], async function (req, res) {
        try {
            const { productId } = req.body;
            const userId = req.session.user._id;
            let userCart = await cartModel.findOne({ user: userId });
            if (!userCart) {
                userCart = new cartModel({ user: userId, items: [] });
            }
            const existingProductIndex = userCart.items.findIndex(item => item.product.toString() === productId);
            if (existingProductIndex !== -1) {
                userCart.items[existingProductIndex].quantity += 1;
            } else {
                userCart.items.push({ product: productId, quantity: 1 });
            }
            await userCart.save();
            res.redirect('/api/products');
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            res.status(500).send('Error al agregar al carrito');
        }
    });
    



    
  }
}

