import ProductService from '../service/product.service.js';
import ProductDTO from '../dto/product.dto.js';
import { CustomError } from '../service/errors/CustomError.js';
import { generatorProductError, generatorProductIdError } from '../service/errors/CauseMessage.js';
import EnumsError from '../service/errors/EnumsError.js';

export default class ProductController {
  static async getAllProducts(req, res) {
    try {
      const { page = 1, limit = 10, sortField = 'defaultField', sortOrder = 'asc' } = req.query;
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
        _id: product._id,
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

  static async getCreateProduct(req, res) {
    try {
      res.render('createProduct');
    } catch (error) {
      console.error('Error al obtener la página de creación de productos:', error);
      res.status(500).send('Error al cargar la página de creación de productos');
    }
  }

  static async createProduct(req, res) {
    try {
      const { title, description, price, thumbnail, code, stock } = req.body;
      if( !title || !description || !price || !thumbnail || !code || !stock){
        throw CustomError.createError({
          name:'Error al crear un producto',
          cause: generatorProductError(req.body),
          message:'Error al crear un producto',
          code: EnumsError.BAD_REQUEST_ERROR,
        });
      }
      const productData = new ProductDTO(title, description, price, thumbnail, code, stock); // Utiliza el DTO para estructurar los datos del producto
      const newProduct = await ProductService.createProduct(productData);
      console.log('Producto creado:', newProduct);
      res.redirect('/api/products');
    } catch (error) {
      console.error('Error al crear productos productos: ', error);
      res.status(500).send('Error al crear productos productos');
    }
  }
  
  static async getDeleteProduct(req, res) {
    try {
      res.render('deleteProduct');
    } catch (error) {
      console.error('Error al obtener la página de  borrar productos: ', error);
      res.status(500).send('Error al cargar la página de borrar productos');
    }
  }

  static async deleteProductById(req, res) {
    try {
      const { _id } = req.body;
      if (!_id) {
        CustomError.createError({
          name: 'Error validando el id del producto',
          cause: generatorProductIdError(_id),
          message: 'Ocurrio un error mientras obteniamos el producto por id.',
          code: EnumsError.BAD_REQUEST_ERROR,
        });
      }

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

  static async getUpdateProduct(req, res) {
    try {
      res.render('updateProduct');
    } catch (error) {
      console.error('Error al obtener la página de actualizacion de productos: ', error);
      res.status(500).send('Error al cargar la página de actualizacion de productos');
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
