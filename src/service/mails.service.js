import nodemailer from 'nodemailer';
import config from '../config.js';
import jwt from 'jsonwebtoken';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.google_user,
        pass: config.google_pass,
      },
    })
  }

  sendEmail(to, subject, html, attachments = []) {
    return this.transporter.sendMail({
      from: config.google_user,
      to,
      subject,
      html,
      attachments,
    });
  }
  
  sendPasswordResetEmail(to, token) {
    // Construir la URL con el token como parámetro
    const resetUrl = `http://localhost:8080/reset-password?token=${token}`;

    // Construir el contenido del correo
    const html = `
        <p>Para restablecer tu contraseña, haz clic en el siguiente enlace: <a href="${resetUrl}">${resetUrl}</a></p>
    `;

    // Enviar el correo
    return this.sendEmail(to, 'Restablecer contraseña', html);
  }

}

export default new EmailService();