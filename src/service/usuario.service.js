import UsuarioDAO from "../dao/usuario.mongodb.dao.js";

export default class UsuarioService {

    static async getAllUsers() {
        try {
          const users = await UsuarioDAO.getAllUsers();
          return users;
        } catch (error) {
          throw new Error(`Error al obtener todos los usuarios: ${error.message}`);
        }
      }

    static async createUser(userData) {
        try {
        const newUser = await UsuarioDAO.createUser(userData);
        return newUser;
        } catch (error) {
        throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    static async findUserByEmail(email) {
        try {
        const user = await UsuarioDAO.findUserByEmail(email);
        return user;
        } catch (error) {
        throw new Error(`Error al buscar usuario por correo electrónico: ${error.message}`);
        }
    }

    static async findUserById(userId) {
        try {
        const user = await UsuarioDAO.findUserById(userId);
        return user;
        } catch (error) {
        throw new Error(`Error al buscar usuario por ID: ${error.message}`);
        }
    }

    static async updateUserById(userId, userData) {
        try {
        const updatedUser = await UsuarioDAO.updateUserById(userId, userData);
        return updatedUser;
        } catch (error) {
        throw new Error(`Error al actualizar usuario por ID: ${error.message}`);
        }
    }

    static async deleteUserById(userId) {
        try {
        await UsuarioDAO.deleteUserById(userId);
        } catch (error) {
        throw new Error(`Error al borrar usuario por ID: ${error.message}`);
        }
    }
}