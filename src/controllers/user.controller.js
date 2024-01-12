

export default class UserController {

  static async login(req, res) {
    try {
        //logica para iniciar session
        req.session.user = req.user;
        const userId = req.session.user._id;
        const existingCart = await cartModel.findOne({ user: userId })
        if (!existingCart) {
            const newCart = new cartModel({ user: userId, items: [] });
            await newCart.save();
            console.log('¡Se ha creado un nuevo carrito para el usuario!');
        }
        res.redirect('/api/products');
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      res.status(500).send('Error en el inicio de sesión');
    }
  }

  static async logout(req, res) {
    try {
      // Logica para cerrar sesión
      req.session.destroy((err) => {
        if (err) {
          console.error('Error al cerrar sesión:', err);
          return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login');
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      res.status(500).send('Error al cerrar sesión');
    }
  }

  static async githubLogin(req, res) {
    // Logica para iniciar sesión con GitHub
  }

  static async githubCallback(req, res) {
    // Logica para el callback de inicio de sesión con GitHub
  }

  static async recoverPassword(req, res) {
    // Logica para recuperación de contraseña
  }

  static async getCurrentSession(req, res) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: 'No hay sesión activa' });
      }
      

      const userDTO = {
        // Datos del usuario obtenidos desde la sesión
      };

      res.status(200).json(userDTO);
    } catch (error) {
      console.error('Error al obtener información de sesión:', error);
      res.status(500).json({ error: 'Error al obtener información de sesión' });
    }
  }
}
