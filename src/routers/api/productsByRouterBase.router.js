import RouterBase from "./RouterBase.js";
import productModel from "../../models/product.model.js";

export default class productByRouterBase extends RouterBase {
  init() {
    this.get('/products', ['PUBLIC'], async function (req, res) {
        const { page = 1, limit = 10, sortField = 'defaultField', sortOrder = 'asc' } = req.query;
    
        const opts = { page, limit, sort: { [sortField]: sortOrder } };
        const criteria = {};
        
        const result = await productModel.paginate(criteria, opts);
        const response = buildResponse(result, sortField, sortOrder, req.session.user && req.session.user.userId);
        response.user = req.session.user;
        res.render('products', response);
    });

    this.get('/products/:pid', ['PUBLIC'], async (req, res) => {
        try {
            const { params: { pid } } = req;
            const product = await productModel.findById(pid); 
    
            if (!product) {
                res.status(404).send('Producto no encontrado');
                return;
            }
    
            const response = {
                title: product.title,
                thumbnail: product.thumbnail,
                description: product.description,
                price: product.price,
                code: product.code,
                stock: product.stock,
                id: product._id
            };
            response.user = req.session.user;
            
            res.render('product', response);
        } catch (error) {
            console.error('No se pudo traer el producto', error);
            res.status(500).send('Error al cargar producto');
        }
    })
    
    
    this.get('/createProduct', ['ADMIN'], (req, res) => {
        res.render('createProduct');
    });
    
    this.post('/createProduct', ['ADMIN'], async (req, res) => {
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
    
    
    this.get('/deleteProduct', ['ADMIN'], async (req,res)=>{
        res.render('deleteProduct')
    })
    
    this.post('/deleteProduct', ['ADMIN'], async (req, res) => {
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
    
    this.get('/updateProduct', ['ADMIN'], async (req,res)=>{
        res.render('updateProduct')
    })
    
    this.post('/updateProduct', ['ADMIN'], async (req, res) => {
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




  }
}


const buildResponse = (data, sortField, sortOrder, userId) => {
    const response = {
        status: 'success',
        payload: data.docs.map(product => {
            const productData = product.toJSON();
            if (userId) {
                productData.userId = userId;
            }
            return productData;
        }),
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