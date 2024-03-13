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


  handlePolicies = (policies) => async (req, res, next) => {
    try {
        const role = req.session.user ? req.session.user.role : null;

        if (policies.includes('PUBLIC')) {
            return next();
        }

        switch (role) {
            case 'usuario':
                if (req.path === '/addToCart' && req.method === 'POST') {
                    return next();
                }
                break;
            case 'ADMIN':
              if (
                  req.path.startsWith('/createProduct') ||
                  req.path.startsWith('/deleteProduct') ||
                  req.path.startsWith('/updateProduct') ||
                  req.path.startsWith('/users-information') ||
                  req.path.startsWith('/user/premium/:id') ||
                  req.path.startsWith('/user/delete/:id') ||
                  req.path.startsWith('/users/delete-users-inactives')
                  ) {
                      return next();
                  }
              break;

            case 'premium':
                if (
                    req.path.startsWith('/createProduct') ||
                    req.path.startsWith('/deleteProduct') ||
                    req.path.startsWith('/updateProduct')
                ) {
                    return next();
                }
                break;
            default:
                return res.status(401).json({ message: 'No estas autorizado por tu nivel de usuario!' });
        }
        return res.status(401).json({ message: 'Inautorizado' });
    } catch (error) {
        console.error('An error occurred:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


    
}