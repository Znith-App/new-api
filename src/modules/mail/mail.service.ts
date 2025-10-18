import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    try {
      await this.transporter.sendMail({
        from: `"Zenith" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new Error('Falha ao enviar e-mail');
    }
  }
}
