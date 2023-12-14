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
    if (policies[0] === 'PUBLIC') {
        return next();
    } 
    const {role} = req.session.user;
    if (role === 'ADMIN'){
        return next();
    } else {
        return res.status(401).json({ message: 'unauthorized 🖐️' });
    }
  }

  
}