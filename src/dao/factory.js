import config from "../config.js";

export let ProductDao;

switch (config.persistence) {
    
  case 'mongodb':
    ProductDao = (await import('./product.mongodb.dao.js')).default;
    console.log('product mongodb');
    break;

  default:
    ProductDao = (await import('./product.memory.dao.js')).default;
    console.log('product memory');
    break;
}