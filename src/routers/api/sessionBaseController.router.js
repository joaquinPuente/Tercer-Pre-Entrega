import RouterBase from './RouterBase.js';
import UsuarioController from '../../controllers/usuario.controller.js';

export default class SessionRouter extends RouterBase {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.get('/users', ['PUBLIC'], UsuarioController.getAllUsers );
    
  }

  getRouter() {
    return this.router;
  }

}
