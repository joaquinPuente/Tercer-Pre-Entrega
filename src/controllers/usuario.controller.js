import cartModel from "../dao/models/cart.model.js";
import userModel from "../dao/models/user.model.js";
import UsuarioService from "../service/usuario.service.js";
import { createHash, isValidPassword } from "../utils.js";
import emailService from '../service/mails.service.js'
import jwt from 'jsonwebtoken'
import config from '../config.js'
import UserDTO from "../dto/user.dto.js";
import AdminUserDTO from "../dto/admin.user.dto.js";

export default class UsuarioController {

    static async getAllUsers(req, res) {
        try {
          const users = await UsuarioService.getAllUsers();
          res.status(200).json(users);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    }

    static async getAllUsersInfo(req, res) {
      try {
        const users = await UsuarioService.getAllUsers();
        const adminUserDTO = new AdminUserDTO(users);
        res.render('users', adminUserDTO); 
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

    static async deleteUsersInactives(req, res) {
      try {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const usersToDelete = await userModel.find({ last_connection: { $lt: yesterday } });
          const deletedUsersCount = usersToDelete.length;
          if (deletedUsersCount > 0) {
              const usersDeletedPromises = usersToDelete.map(async user => {
                  // Envía un correo de notificación para cada usuario eliminado
                  const message = `Tu cuenta ha sido eliminada de la página debido a inactividad.`;
                  await emailService.sendEmail(
                      user.email, // Correo del usuario eliminado
                      'Tu cuenta ha sido eliminada', // Asunto del correo
                      message // Contenido del correo
                  );
              });
              await Promise.all(usersDeletedPromises); // Espera a que se envíen todos los correos
              // Elimina los usuarios de la base de datos
              await userModel.deleteMany({ last_connection: { $lt: yesterday } });
              res.status(200).json({ message: `${deletedUsersCount} usuarios eliminados correctamente.` });
          } else {
              res.status(404).json({ message: 'No se encontraron usuarios para eliminar.' });
          }
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
    }

    static async login(req, res) {
        try {
            req.session.user = req.user;
            const userId = req.session.user._id;
            const existingCart = await cartModel.findOne({ user: userId })
            if (!existingCart) {
                const newCart = new cartModel({ user: userId, items: [] });
                await newCart.save();
                console.log('¡Se ha creado un nuevo carrito para el usuario!');
            }
            const currentDate = new Date();
            currentDate.setHours(currentDate.getHours() - 3);
            await userModel.updateOne({ _id: userId }, { $set: { last_connection: currentDate } });
            req.logger.info('Inicio de sesión correctamente')
            res.status(200).redirect('/api/products');
        } catch (error) {
            req.logger.warning('Error al iniciar sesión:', error);
            res.status(500).send('Error al iniciar sesión');
        }
    }

    static async gitHubCallback (req,res) {
        req.logger.info('req.user ingresado: ', req.user);
        req.session.user = await req.user;
        res.redirect('/api/products')
    }

    static async logout(req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        const userId = req.session.user._id;
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() - 3);
        try {
            await userModel.updateOne({ _id: userId }, { $set: { last_connection: currentDate } });
    
            req.session.destroy((error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Error al cerrar sesión');
                }
                res.redirect('/login');
            });
        } catch (updateError) {
            console.error(updateError);
            return res.status(500).send('Error al cerrar sesión');
        }
    }

    static async getForgotPassword(req,res){
        try {
            res.render('recoveryPassword')
        } catch (error) {
            req.logger.fatal('Error al obtener pagina recoveryPassword.handlebars', error);
        }
    }

    static async forgotPassword(req, res) {
        const { email } = req.body;
        try {
            const token = jwt.sign({ email }, config.jwt_token , { expiresIn: '1h' });
            await emailService.sendPasswordResetEmail(email, token); 
            res.status(200).json('Link correctamente enviado al correo cargado.')
        } catch (error) {
            res.status(500).json({ message: 'Error al enviar el correo de restablecimiento de contraseña' });
        }
    }

    static async getResetPassword(req,res) {
        try {
            const resetToken = req.query.token;
            console.log('resettoken for get', resetToken);
            if (!resetToken) {
                return res.redirect('/forgot-password');
            }
            res.render('resetPassword', { resetToken });
        } catch (error) {
            req.logger.fatal('Error al obtener pagina resetPassword.handlebars', error);
        }
    }

    static async resetPassword(req, res) {
        const { newPassword, resetToken } = req.body;
        try {
            const decoded = jwt.verify(resetToken, config.jwt_token);
            const user = await userModel.findOne({ email: decoded.email });
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            if (isValidPassword(newPassword, user)) {
                return res.status(400).json({ message: 'La nueva contraseña debe ser diferente a la actual, volver atras e ingresar una no usada anteriormente' });
            }
            const hashedPassword = createHash(newPassword);
            await userModel.updateOne({ email: decoded.email }, { $set: { password: hashedPassword } });
            res.status(200).redirect('/login');
        } catch (error) {
            res.status(400).json({ message: 'Token no válido o expirado' });
        }
    }

    static async getCurrentSession (req, res) {
        try {
          if (!req.session.user) {
            return res.status(401).json({ error: 'No hay sesión activa' });
          }
          const user = await userModel.findById(req.session.user._id);
          if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
          }
          const userData = new UserDTO(user.toObject());  
          req.logger.info('Inicio de sesión correctamente')
          res.status(200).render('current', { user: userData });
        } catch (error) {
          req.logger.fatal('Error al obtener información de sesión:', error);
          res.status(500).json({ error: 'Error al obtener información de sesión' });
        }
      };

    static async uploadDocument(req, res) {
        try {
            const userId = req.params.uid;
            const typeFile = req.params.typeFile;

            if (!req.file) {
                return res.status(400).json({ error: 'Debe proporcionar un archivo' });
            }
    
            const user = await UsuarioService.findUserById(userId);
            
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
    
            const name = typeFile;
            const reference = path.join(__dirname, '..', 'documents',  `${userId}_${typeFile}` );
    
            user.documents.push({ name, reference }); 
            await UsuarioService.updateUser(user);
    
            return res.status(200).json({ message: 'Documento subido correctamente' });
        } catch (error) {
            console.error('Error al subir documentos:', error);
            return res.status(500).json({ error: 'Error al subir documentos' });
        }
      }

    static async updateToPremium(req, res) {
        try {
            const userId = req.params.id;
            const userToUpdate = await UsuarioService.findUserById(userId);
            
            if (!userToUpdate) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
    
            const requiredDocuments = ['Identificacion', 'ComprobanteDeDomicilio', 'ComprobanteDeCuenta'];
            const userDocuments = userToUpdate.documents.map(doc => doc.name);
            const hasAllRequiredDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));
    
            if (hasAllRequiredDocuments) {
                const newRole = userToUpdate.role === 'usuario' ? 'premium' : 'usuario';
                await UsuarioService.updateUserById(userId, { role: newRole });
                return res.status(200).json({ message: 'Rol de usuario actualizado correctamente' });
            } else {
                return res.status(400).json({ error: 'El usuario debe cargar todos los documentos requeridos para ser premium' });
            }
        } catch (error) {
            console.error('Error al actualizar el rol del usuario:', error);
            res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
        }
      }

}