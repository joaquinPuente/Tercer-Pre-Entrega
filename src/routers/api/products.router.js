import {Router} from 'express';
import productModel from '../../models/product.model.js';

const router = Router();

const privateRouter = (req,res,next)=>{
    if(!req.session.user){
      return res.redirect('/login')
    }
    next();
  }

//mongoose-paginate
router.get('/products', privateRouter ,async (req, res) => {
    const { page = 1, limit = 5, sortField = 'defaultField', sortOrder = 'asc' } = req.query;

    const opts = { page, limit, sort: { [sortField]: sortOrder } };
    const criteria = {};

    const result = await productModel.paginate(criteria, opts);
    const response = buildResponse(result, sortField, sortOrder);
    response.user = req.session.user

    res.render('products', response );
});

router.get('/products/:pid', async (req, res) => {
    try {
        const { params: { pid } } = req;
        const product = await productModel.findById(pid); 
        if (!product) {
            res.status(404).send('Producto no encontrado');
            return;
        }
        res.render('product', {
            title: product.title,
            thumbnail: product.thumbnail,
            description: product.description,
            price: product.price,
            code: product.code,
            stock: product.stock
        });
    } catch (error) {
        console.error('No se pudo traer el producto', error);
        res.status(500).send('Error al cargar producto');
    }
});


router.get('/createProduct', (req, res) => {
    res.render('createProduct');
});

router.post('/createProduct', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock } = req.body;
        const productData = { title, description, price, thumbnail, code, stock };
        const newProduct = new productModel(productData);
        const product = await newProduct.save();
        if (!product) {
            console.error('No se pudo crear el producto');
            res.status(500).json({ success: false, message: 'Error al crear el producto' });
            return;
        }
        console.log('Producto creado: ', product);
        res.redirect('/api/products');
    } catch (error) {
        console.error('Error al crear el producto', error.message);
        res.status(500).json({ success: false, message: 'Error al crear producto', error: error.message });
    }
});


router.get('/deleteProduct', async (req,res)=>{
    res.render('deleteProduct')
})

router.post('/deleteProduct', async (req, res) => {
    try {
        const { _id } = req.body;
        const deletedProduct = await productModel.findByIdAndDelete(_id);
        if (!deletedProduct) {
            console.error('Producto no encontrado o no se pudo eliminar');
            res.status(404).send('Producto no encontrado o no se pudo eliminar');
            return;
        }
        console.log('Producto Eliminado', _id);
        res.status(204).redirect('/api/products');
    } catch (error) {
        console.error('No se pudo borrar el producto', error);
        res.status(500).send('Error al borrar producto');
    }
});

router.get('/updateProduct', async (req,res)=>{
    res.render('updateProduct')
})

router.post('/updateProduct', async (req, res) => {
    try {
        const { _id, title, description, price, thumbnail, code, stock } = req.body;
        const updateData = { title, description, price, thumbnail, code, stock };
        const updatedProduct = await productModel.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedProduct) {
            console.error('Producto no encontrado o no se pudo actualizar');
            res.status(404).send('Producto no encontrado o no se pudo actualizar');
            return;
        }
        console.log('Producto Actualizado', updatedProduct);
        res.status(204).redirect('/api/products');
    } catch (error) {
        console.error('No se pudo actualizar el producto', error);
        res.status(500).send('Error al actualizar producto');
    }
});

const buildResponse = (data, sortField, sortOrder) => {
    const response = {
        status: 'success',
        payload: data.docs.map(student => student.toJSON()),
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage
    };
    if (sortField && sortOrder) {
        response.sortField = sortField;
        response.sortOrder = sortOrder;
    }
    response.prevLink = data.hasPrevPage ? `http://localhost:8080/api/products?limit=${data.limit}&page=${data.prevPage}&sortField=${sortField}&sortOrder=${sortOrder}` : '';
    response.nextLink = data.hasNextPage ? `http://localhost:8080/api/products?limit=${data.limit}&page=${data.nextPage}&sortField=${sortField}&sortOrder=${sortOrder}` : '';
    return response;
};



export default router;