import express from "express";
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import passport from 'passport'
import homeRouter from './routers/api/home.router.js';
import chatRouter from './routers/api/chat.router.js';
import indexRouter from './routers/api/index.router.js';
import sessionRouter from './routers/api/sessions.router.js'
import mockingProduct from './routers/api/mockingProduct.router.js'

import ProductBaseController from "./routers/api/productBaseController.router.js";
import CartBaseController from "./routers/api/cartBaseController.router.js";
import SessionBaseController from "./routers/api/sessionBaseController.router.js"
import TicketBaseController from './routers/api/ticketBaseController.router.js'

import ExpressSession from 'express-session'
import mongoStore from 'connect-mongo'
import path from 'path';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import config from "./config.js";
import { init as initPassportConfig } from './config/passport.config.js';
import errorHandler from "./middlewares/ErrorHandler.js";
import { addLogger } from "./config/logger.js";


const app = express();
const secret = config.sessionSecret;

const productBaseController = new ProductBaseController()
const cartBaseController = new CartBaseController()
const sessionBaseController = new SessionBaseController()
const ticketBaseController = new TicketBaseController()

app.use(ExpressSession({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  store: mongoStore.create({
    mongoUrl: config.mongoUri,
    mongoOptions:{},
    ttl:3600
  }),
  })
)

app.use(addLogger)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

initPassportConfig()
app.use(passport.initialize())
app.use(passport.session())

const swaggerOptions = {
    definition:{ 
        openapi:'3.0.1',
        info: {
            title: 'Ecommerce API',
            description: 'Esta es la documentacion de la API creada en el curso de CoderHouse. Para que funcionen correctamente las rutas mostradas en el documento, es necesario iniciar sesion o registrarse e iniciar sesion. Todo esta diseñado para que se haga todo desde las vistas'
        }
    },
    apis:[path.join( __dirname,'docs', '**', '*.yaml')]
}
const specs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use('/', homeRouter, indexRouter, sessionRouter, mockingProduct );
app.use('/api', productBaseController.getRouter() , cartBaseController.getRouter(), ticketBaseController.getRouter() ,chatRouter);

app.use(errorHandler);


export default app;
