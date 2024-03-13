import nodemailer from 'nodemailer';
import config from '../config.js';

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
    const resetUrl = `http://localhost:8080/reset-password?token=${token}`;
    const html = `
        <p>Para restablecer tu contraseña, haz clic en el siguiente enlace: <a href="${resetUrl}">${resetUrl}</a></p>
    `;
    return this.sendEmail(to, 'Restablecer contraseña', html);
  }

}

export default new EmailService();