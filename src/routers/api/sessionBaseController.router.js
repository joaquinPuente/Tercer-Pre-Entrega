import RouterBase from './RouterBase.js';
import UsuarioController from '../../controllers/usuario.controller.js';
import passport from 'passport';
import { uploader } from '../../utils.js';

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
      return res.status(401).json({ error: 'No hay sesión activa' });
  }
  next();
};

export default class SessionRouter extends RouterBase {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.get('/users', ['PUBLIC'], UsuarioController.getAllUsersInfo );
    this.get('/api/session/current', ['PUBLIC'], requireAuth, UsuarioController.getCurrentSession);
    this.post('/sessions', ['PUBLIC'],  passport.authenticate('register', { failureRedirect: '/register' }), UsuarioController.login);
    this.post('/login', ['PUBLIC'], passport.authenticate('login', { failureRedirect: '/login' }), UsuarioController.login);
    this.get('/session/github', ['PUBLIC'], passport.authenticate('github', {scope: ['user.email']}) )
    this.get('/api/session/github-callback', ['PUBLIC'], passport.authenticate('github',{failureRedirect:'/login'}), UsuarioController.gitHubCallback)
    this.get('/logout', ['PUBLIC'],  UsuarioController.logout);
    this.get('/forgot-password', ['PUBLIC'], UsuarioController.getForgotPassword);
    this.post('/forgot-password', ['PUBLIC'], UsuarioController.forgotPassword);
    this.get('/reset-password', ['PUBLIC'], UsuarioController.getResetPassword);
    this.post('/reset-password', ['PUBLIC'], UsuarioController.resetPassword);
    this.post('/users/:uid/documents/:typeFile', ['PUBLIC'], requireAuth, uploader.single('file'), UsuarioController.uploadDocument )
    this.get('/user/premium/:id', ['PUBLIC'], UsuarioController.updateToPremium )
    this.delete('/users/delete-users-inactives', ['PUBLIC'], UsuarioController.deleteUsersInactives )
  }

  getRouter() {
    return this.router;
  }

}
