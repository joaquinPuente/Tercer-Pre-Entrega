import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import {faker} from '@faker-js/faker'
import multer from 'multer'
import fs from 'fs'

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

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const { params: { typeFile }} = req;
    let folderPath = null;

    if(typeFile == 'Document'){
      folderPath = path.resolve(__dirname, '..', 'documents', 'documents');
    }
    if(typeFile == 'Product'){
      folderPath = path.resolve(__dirname, '..', 'documents', 'products');
    }
    if(typeFile == 'Profile'){
      folderPath = path.resolve(__dirname, '..', 'documents', 'profiles');
    }
    if(typeFile == 'Identificacion'){
      folderPath = path.resolve(__dirname, '..', 'documents', 'identificacion');
    }
    if(typeFile == 'ComprobanteDeDomicilio'){
      folderPath = path.resolve(__dirname, '..', 'documents', 'ComprobanteDeDomicilio');
    }
    if(typeFile == 'ComprobanteDeCuenta'){
      folderPath = path.resolve(__dirname, '..', 'documents', 'ComprobanteDeCuenta');
    }
    if(!folderPath){
      return 'Error al reconocer el folderPath'
    }

    console.log('folderPath',folderPath);
    fs.mkdirSync(folderPath, {recursive:true})
    callback(null, folderPath)
  },

  filename: (req,file,callback) => {
    const uid = req.params.uid; 
    const typeFile = req.query.typeFile;
    callback(null, `${uid}_${typeFile}_${file.originalname}`);
  },
})

export const uploader = multer({storage})