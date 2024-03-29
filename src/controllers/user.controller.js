import UserDTO from "../dto/user.dto.js";

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

  static async getCurrentSession(req, res) {
    try {
      //infomacion sobre la actual sesion
      if (!req.session.user) {
        return res.status(401).json({ error: 'No hay sesión activa' });
      }
      const user = req.session.user;
      const userDTO = UserDTO(user)
      res.status(200).json(userDTO);
    } catch (error) {
      console.error('Error al obtener información de sesión:', error);
      res.status(500).json({ error: 'Error al obtener información de sesión' });
    }
  }
}
