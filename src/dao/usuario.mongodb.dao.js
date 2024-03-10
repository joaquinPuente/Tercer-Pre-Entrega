import userModel from "./models/user.model.js";

export default class UsuarioDAO {

    static async getAllUsers() {
        try {
          const users = await userModel.find();
          return users;
        } catch (error) {
          throw new Error(`Error al obtener todos los usuarios: ${error.message}`);
        }
    }


    static async createUser(userData) {
        try {
        const newUser = await userModel.create(userData);
        return newUser;
        } catch (error) {
        throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    static async findUserByEmail(email) {
        try {
        const user = await userModel.findOne({ email });
        return user;
        } catch (error) {
        throw new Error(`Error al buscar usuario por correo electrónico: ${error.message}`);
        }
    }

    static async findUserById(userId) {
        try {
        const user = await userModel.findById(userId);
        return user;
        } catch (error) {
        throw new Error(`Error al buscar usuario por ID: ${error.message}`);
        }
    }

    static async updateUserById(userId, userData) {
        try {
        const updatedUser = await userModel.findByIdAndUpdate(userId, userData, { new: true });
        return updatedUser;
        } catch (error) {
        throw new Error(`Error al actualizar usuario por ID: ${error.message}`);
        }
    }

    static async deleteUserById(userId) {
        try {
        await userModel.findByIdAndDelete(userId);
        } catch (error) {
        throw new Error(`Error al borrar usuario por ID: ${error.message}`);
        }
    }
}
