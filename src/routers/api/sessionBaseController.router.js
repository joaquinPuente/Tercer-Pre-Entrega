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

    this.get('/users-information', ['ADMIN'], UsuarioController.getAllUsersInfo );
    this.get('/user/premium/:id', ['ADMIN'], UsuarioController.updateToPremiumRedirect );
    this.get('/user/delete/:id', ['ADMIN'], UsuarioController.deleteUserById )
    this.post('/users/:uid/documents/:typeFile', ['PUBLIC'], requireAuth, uploader.single('file'), UsuarioController.uploadDocument);
    this.delete('/users/delete-users-inactives', ['ADMIN'], UsuarioController.deleteUsersInactives);

    this.get('/api/session/current', ['PUBLIC'], requireAuth, UsuarioController.getCurrentSession);

    this.post('/sessions', ['PUBLIC'],  passport.authenticate('register', { failureRedirect: '/register' }), UsuarioController.login);
    this.post('/login', ['PUBLIC'], passport.authenticate('login', { failureRedirect: '/login' }), UsuarioController.login);
    this.get('/logout', ['PUBLIC'],  UsuarioController.logout);
    this.get('/forgot-password', ['PUBLIC'], UsuarioController.getForgotPassword);
    this.post('/forgot-password', ['PUBLIC'], UsuarioController.forgotPassword);
    this.get('/reset-password', ['PUBLIC'], UsuarioController.getResetPassword);
    this.post('/reset-password', ['PUBLIC'], UsuarioController.resetPassword);

    this.get('/session/github', ['PUBLIC'], passport.authenticate('github', {scope: ['user.email']}) );
    this.get('/api/session/github-callback', ['PUBLIC'], passport.authenticate('github',{failureRedirect:'/login'}), UsuarioController.gitHubCallback);
    
  }

  getRouter() {
    return this.router;
  }

}
