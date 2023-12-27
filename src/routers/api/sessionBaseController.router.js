import RouterBase from './RouterBase.js';
import UserController from '../../controllers/user.controller.js';

export default class SessionRouter extends RouterBase {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.post('/sessions', ['PUBLIC'], UserController.login);
    this.post('/login', ['PUBLIC'], UserController.login);
    this.get('/logout', ['PUBLIC'], UserController.logout);
    this.get('/session/github', ['PUBLIC'], UserController.githubLogin);
    this.get('/api/session/github-callback', ['PUBLIC'], UserController.githubCallback);
    this.post('/recovery', ['PUBLIC'], UserController.recoverPassword);
    this.get('/api/session/current', ['ADMIN'], UserController.getCurrentSession);
  }
}
