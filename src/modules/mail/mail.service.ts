import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendMail(to: string, subject: string, text: string) {
    try {
      const fromEmail = process.env.MAIL_FROM || 'no-reply@zenith.com';

      const response = await this.resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html: `<p>${text}</p>`,
      });

      console.log('E-mail enviado com sucesso!', response);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new Error('Falha ao enviar e-mail');
    }
  }
}