import ProductService from '../service/product.service.js';

export default class ProductController {
  static async getAllProducts(req, res) {
    try {
      const { page = 1, limit = 5, sortField = 'defaultField', sortOrder = 'asc' } = req.query;
      const opts = { page, limit, sort: { [sortField]: sortOrder } };
      const criteria = {};

      const result = await ProductService.getAllProducts(criteria, opts);
      const response = buildResponse(result, sortField, sortOrder);
      response.user = req.session.user;

      res.render('products', response);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).send('Error al obtener productos');
    }
  }

  static async getProductById(req, res) {
    try {
      const { pid } = req.params;
      const product = await ProductService.getProductById(pid);

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
      console.error('Error al obtener producto por ID:', error);
      res.status(500).send('Error al obtener producto por ID');
    }
  }

  static async createProduct(req, res) {
    try {
      const { title, description, price, thumbnail, code, stock } = req.body;
      const productData = { title, description, price, thumbnail, code, stock };
      const newProduct = await ProductService.createProduct(productData);

      if (!newProduct) {
        console.error('No se pudo crear el producto');
        res.status(500).json({ success: false, message: 'Error al crear el producto' });
        return;
      }

      console.log('Producto creado:', newProduct);
      res.redirect('/api/products');
    } catch (error) {
      console.error('Error al crear el producto:', error.message);
      res.status(500).json({ success: false, message: 'Error al crear producto', error: error.message });
    }
  }

  static async deleteProductById(req, res) {
    try {
      const { _id } = req.body;
      const deletedProduct = await ProductService.deleteProductById(_id);

      if (!deletedProduct) {
        console.error('Producto no encontrado o no se pudo eliminar');
        res.status(404).send('Producto no encontrado o no se pudo eliminar');
        return;
      }

      console.log('Producto Eliminado', _id);
      res.status(204).redirect('/api/products');
    } catch (error) {
      console.error('No se pudo borrar el producto:', error);
      res.status(500).send('Error al borrar producto');
    }
  }

  static async updateProductById(req, res) {
    try {
      const { _id, title, description, price, thumbnail, code, stock } = req.body;
      const updateData = { title, description, price, thumbnail, code, stock };
      const updatedProduct = await ProductService.updateProductById(_id, updateData);

      if (!updatedProduct) {
        console.error('Producto no encontrado o no se pudo actualizar');
        res.status(404).send('Producto no encontrado o no se pudo actualizar');
        return;
      }

      console.log('Producto Actualizado', updatedProduct);
      res.status(204).redirect('/api/products');
    } catch (error) {
      console.error('No se pudo actualizar el producto:', error);
      res.status(500).send('Error al actualizar producto');
    }
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
