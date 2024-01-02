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
}

export default new EmailService();