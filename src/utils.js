import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import {faker} from '@faker-js/faker'

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password,user) => bcrypt.compareSync(password, user.password);

export const generateProduct = () => {
    return {
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      price: parseFloat(faker.commerce.price()),
      thumbnail: faker.image.url(200, 200, 'cat'),
      code: faker.string.uuid(),
      stock: faker.number.int({ min: 1, max: 100 }),
    };
};