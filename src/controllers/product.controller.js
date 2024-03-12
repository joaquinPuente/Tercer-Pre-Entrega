import ProductService from '../service/product.service.js';
import ProductDTO from '../dto/product.dto.js';
import { CustomError } from '../service/errors/CustomError.js';
import { generatorProductError, generatorProductIdError } from '../service/errors/CauseMessage.js';
import EnumsError from '../service/errors/EnumsError.js';
import emailService from '../service/mails.service.js'

export default class ProductController {
  static async getAllProducts(req, res) {
    try {
      const { page = 1, limit = 10, sortField = 'defaultField', sortOrder = 'asc' } = req.query;
      const opts = { page, limit, sort: { [sortField]: sortOrder } };
      const criteria = {};

      const result = await ProductService.getAllProducts(criteria, opts);
      const response = buildResponse(result, sortField, sortOrder);
      response.user = req.session.user;

      req.logger.info('Obtenidos todos los productos exitosamente');
      res.status(200).render('products', response);
    } catch (error) {
      req.logger.error('Error al obtener productos:', error);
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

      req.logger.info('Obtenido producto por ID exitosamente');
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
      req.logger.error('Error al obtener producto por ID:', error);
      res.status(500).send('Error al obtener producto por ID');
    }
  }

  static async getCreateProduct(req, res) {
    try {
      req.logger.info('Obtenida página de creación de productos exitosamente');
      res.render('createProduct');
    } catch (error) {
      req.logger.error('Error al obtener la página de creación de productos:', error);
      res.status(500).send('Error al cargar la página de creación de productos');
    }
  }

  static async createProduct(req, res) {
    try {
      const { title, description, price, thumbnail, code, stock } = req.body;
      const currentUser = req.user;
      if( !title || !description || !price || !thumbnail || !code || !stock){
        throw CustomError.createError({
          name:'Error al crear un producto',
          cause: generatorProductError(req.body),
          message:'Error al crear un producto',
          code: EnumsError.BAD_REQUEST_ERROR,
        });
      }
      const productData = new ProductDTO(
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        {
          role: currentUser.role,
          email: currentUser.email,
        }
      );
      const newProduct = await ProductService.createProduct(productData);
      req.logger.info('Producto creado exitosamente:', newProduct);
      res.redirect('/api/products');
    } catch (error) {
      req.logger.error('Error al crear productos productos: ', error);
      res.status(500).send('Error al crear productos productos');
    }
  }
  
  static async getDeleteProduct(req, res) {
    try {
      req.logger.info('Obtenida página de borrar productos exitosamente')
      res.render('deleteProduct');
    } catch (error) {
      req.logger.error('Error al obtener la página de  borrar productos: ', error);
      res.status(500).send('Error al cargar la página de borrar productos');
    }
  }

  static async deleteProductById(req, res) {
    try {
        const { _id } = req.body;
        if (!_id) {
            throw CustomError.createError({
                name: 'Error validando el id del producto',
                cause: generatorProductIdError(_id),
                message: 'Ocurrió un error mientras obteníamos el producto por id.',
                code: EnumsError.BAD_REQUEST_ERROR,
            });
        }
        const productToDelete = await ProductService.getProductById(_id);
        if (!productToDelete) {
            req.logger.error('Producto no encontrado');
            res.status(404).send('Producto no encontrado');
            return;
        }
        const currentUser = req.user;
        if (currentUser.role === 'premium' && productToDelete.owner.email !== currentUser.email) {
            req.logger.error('Usuario premium no autorizado para borrar este producto');
            res.status(403).send('Acceso no autorizado');
            return;
        }
        await emailService.sendEmail(
            productToDelete.owner.email, 
            'Tu producto ha sido eliminado', 
            `Hola ${productToDelete.owner.name},\n\nTu producto "${productToDelete.name}" ha sido eliminado.` // Contenido del correo
        );

        const deletedProduct = await ProductService.deleteProductById(_id);
        if (!deletedProduct) {
            req.logger.error('Producto no se pudo eliminar');
            res.status(500).send('Producto no se pudo eliminar');
            return;
        }
        req.logger.info('Producto Eliminado', _id);
        res.status(204).redirect('/api/products');
    } catch (error) {
        req.logger.error('No se pudo borrar el producto:', error);
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
        const productToUpdate = await ProductService.getProductById(_id);
        if (!productToUpdate) {
            req.logger.error('Producto no encontrado');
            res.status(404).send('Producto no encontrado');
            return;
        }
        const currentUser = req.user;
        if (currentUser.role === 'premium' && productToUpdate.owner.email !== currentUser.email) {
            req.logger.error('Usuario premium no autorizado para actualizar este producto');
            res.status(403).send('Acceso no autorizado');
            return;
        }
        const updatedProduct = await ProductService.updateProductById(_id, updateData);
        if (!updatedProduct) {
            req.logger.error('Producto no se pudo actualizar');
            res.status(500).send('Producto no se pudo actualizar');
            return;
        }
        req.logger.info('Producto Actualizado', updatedProduct);
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
