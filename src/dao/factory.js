import config from "../config.js";

let ProductDao;
let UserDao;
let CartDao;

console.log('FACTORY_PERSISTANCE:', config.persistence);

switch (config.persistence) {
  case 'mongodb':
    const MongoDBProductDaoModule = await import('./product.mongodb.dao.js');
    const MongoDBUserDaoModule = await import('./user.mongodb.dao.js');
    const MongoDBCartDaoModule = await import('./cart.mongodb.dao.js');

    ProductDao = MongoDBProductDaoModule.default;
    UserDao = MongoDBUserDaoModule.default;
    CartDao = MongoDBCartDaoModule.default;
    break;

  case 'memory':
    const MemoryProductDao = await import('./product.memory.dao.js');
    const MemoryUserDao = await import('./user.memory.dao.js');
    const MemoryCartDao = await import('./cart.memory.dao.js');

    ProductDao = MemoryProductDao.default;
    UserDao = MemoryUserDao.default;
    CartDao = MemoryCartDao.default;
    throw new Error('Persistencia no configurada');

    break;

  default:
    throw new Error('Error al leer Factory_persistence');
}

export { ProductDao, UserDao, CartDao };