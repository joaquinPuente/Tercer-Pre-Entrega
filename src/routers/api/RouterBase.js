import { Router } from 'express';

export default class RouterBase {
  constructor() {
    this.router = Router();
    this.init();
  }

  getRouter() {
    return this.router;
  }

  init() {}

  get(path, policies, ...callbacks) {
    this.router.get(path, this.handlePolicies(policies), this.applyCallbacks(callbacks));
  }

  post(path, policies, ...callbacks) {
    this.router.post(path, this.handlePolicies(policies), this.applyCallbacks(callbacks));
  }

  postWithoutPolicies(path, ...callbacks) {
    this.router.post(path, this.generateCustomeResponse, this.applyCallbacks(callbacks));
  }

  put(path, policies, ...callbacks) {
    this.router.put(path, this.handlePolicies(policies), this.applyCallbacks(callbacks));
  }

  delete(path, policies, ...callbacks) {
    this.router.delete(path, this.handlePolicies(policies), this.applyCallbacks(callbacks));
  }

  applyCallbacks(callbacks) {
    return callbacks.map((cb) => {
      return async (...params) => {     
        try {
          await cb.apply(this, params);
        } catch (error) {
          console.error('Ah ocurrido un error 😨:', error.message);
          // params[0] -> req
          // params[1] -> res
          // params[2] -> next
          params[1].status(500).json({ message: error.message });
        }
      }
    });
  }

  

  handlePolicies = (policies) => (req, res, next) => {
    const { role } = req.session.user;

    if (policies[0] === 'PUBLIC' && req.path !== '/addToCart') {
        return next();
    }

    if (role === 'usuario' && req.path === '/addToCart' && req.method === 'POST') {
        return next();
    }

    if (role === 'ADMIN' && (
        req.path.startsWith('/createProduct') ||
        req.path.startsWith('/deleteProduct') ||
        req.path.startsWith('/updateProduct')
    )) {
        return next(); // Permitir solo rutas de creación, eliminación o actualización
    } else if (role === 'ADMIN') {
        if (req.path !== '/addToCart') {
            return next();
        } else {
            return res.status(401).json({ message: 'Unauthorized ️' });
        }
    } else {
        return res.status(401).json({ message: 'Unauthorized ️' });
    }
};
    
}