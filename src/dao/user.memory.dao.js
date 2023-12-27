import UserDao from '../dao/user.dao.js'; // Asegúrate de importar el DAO de usuario correctamente

export default class UserManager {
  static async getAllUsers(criteria, options) {
    return await UserDao.getAll(criteria, options);
  }

  static async getUserById(userId) {
    return await UserDao.getById(userId);
  }

  static async createUser(userData) {
    return await UserDao.create(userData);
  }

  static async updateUserById(userId, updatedData) {
    return await UserDao.updateById(userId, updatedData);
  }

  static async deleteUserById(userId) {
    return await UserDao.deleteById(userId);
  }

}