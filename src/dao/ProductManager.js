import products from "../models/product.model.js";


export default class ProductManager{
    
    static async getProducts(query={}){
        const criteria = {};
        if(query.category){
            criteria.category = query.category;
        }
        const productos = await products.find(criteria);
        return productos;
    }

    static async getProductsById(pid){
        const producto = await products.findById(pid);
        if(!producto){
            throw new Error('No existe el id del producto o el producto');
        }
        return producto;
    }
    
    static async createProduct(data){
        try {
            const producto = await products.create(data);
            console.log('Producto Actualizado correctamente👍'); 
            return producto;
        } catch (error) {
            console.log('Error al crear producto', error.message);
        }
    }

    static async updateProductById(pid, data){
        const producto = await products.findById(pid);
        if(!producto){
            throw new Error('No existe el id del producto o el producto');
        }
        const criteria = { _id: pid};
        const operation = {$set:data};
        const result = await products.updateOne(criteria,operation);
        console.log('Producto actualizado: ', result);
    }
    
    static async deleteProductById(pid){
        const producto = await products.findById(pid);
        if(!producto){
            throw new Error('No existe el id del producto o el producto');
        }
        const criteria = { _id: pid};
        await products.deleteOne(criteria);
        console.log('Producto eliminado correctamente :', producto);
    }
}