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

      const { data, error } = await this.resend.emails.send({
        from: `Zenith <${fromEmail}>`,
        to,
        subject,
        text,
      });

      if (error) {
        console.error('Erro ao enviar e-mail:', error);
        throw new Error('Falha ao enviar e-mail');
      }

      console.log('E-mail enviado com sucesso. ID:', data?.id);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new Error('Falha ao enviar e-mail');
    }
  }
}