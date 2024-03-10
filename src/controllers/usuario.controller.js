import UsuarioService from "../service/usuario.service.js";

export default class UsuarioController {

    static async getAllUsers(req, res) {
        try {
          const users = await UsuarioService.getAllUsers();
          res.status(200).json(users);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }

    static async createUser(req, res) {
      try {
        const newUser = await UsuarioService.createUser(req.body);
        res.status(201).json(newUser);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  
    static async getUserByEmail(req, res) {
      try {
        const email = req.params.email;
        const user = await UsuarioService.findUserByEmail(email);
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: 'Usuario no encontrado' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }

    static async getUserById(req, res) {
      try {
        const userId = req.params.userId;
        const user = await UsuarioService.findUserById(userId);
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: 'Usuario no encontrado' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  
    static async updateUserById(req, res) {
      try {
        const userId = req.params.userId;
        const userData = req.body;
        const updatedUser = await UsuarioService.updateUserById(userId, userData);
        if (updatedUser) {
          res.status(200).json(updatedUser);
        } else {
          res.status(404).json({ message: 'Usuario no encontrado' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  
    static async deleteUserById(req, res) {
      try {
        const userId = req.params.userId;
        await UsuarioService.deleteUserById(userId);
        res.status(204).send();
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  }