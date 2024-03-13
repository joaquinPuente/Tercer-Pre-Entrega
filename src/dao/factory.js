import config from "../config.js";

let ProductDao;
let UserDao;
let CartDao;

console.log('FACTORY_PERSISTANCE:', config.persistence);

switch (config.persistence) {
  case 'mongodb':
    const MongoDBProductDao = await import('./product.mongodb.dao.js');
    const MongoDBUserDao = await import('./user.mongodb.dao.js');
    const MongoDBCartDao = await import('./cart.mongodb.dao.js');

    ProductDao = MongoDBProductDao.default;
    console.log('ProductDao', ProductDao);
    UserDao = MongoDBUserDao.default;
    CartDao = MongoDBCartDao.default;
  break;

  default:
    const MemoryProductDao = await import('./product.memory.dao.js');
    const MemoryUserDao = await import('./user.memory.dao.js');
    const MemoryCartDao = await import('./cart.memory.dao.js');

    ProductDao = MemoryProductDao.default;
    UserDao = MemoryUserDao.default;
    CartDao = MemoryCartDao.default;
  break;
}

export { ProductDao, UserDao, CartDao };
