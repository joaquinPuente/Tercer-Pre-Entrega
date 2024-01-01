// Importa las bibliotecas necesarias
import express from "express";
import passport from 'passport'
import homeRouter from './routers/api/home.router.js';
import chatRouter from './routers/api/chat.router.js';
import indexRouter from './routers/api/index.router.js';
import sessionRouter from './routers/api/sessions.router.js'

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


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

initPassportConfig()
app.use(passport.initialize())
app.use(passport.session())

app.use('/', homeRouter, indexRouter, sessionRouter);
app.use('/api', productBaseController.getRouter() , cartBaseController.getRouter(), ticketBaseController.getRouter() ,chatRouter);

app.use((error, req, res, next) => {
  const message = `Ah ocurrido un error desconocido 😨: ${error.message}`;
  console.log(message);
  res.status(500).json({ status: 'error', message });
});


export default app;
