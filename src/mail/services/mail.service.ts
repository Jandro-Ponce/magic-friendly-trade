import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_SMTP_HOST'),
      port: this.configService.get<number>('EMAIL_SMTP_PORT'),
      secure: false, // true solo si usas el puerto 465
      auth: {
        user: this.configService.get('EMAIL_SMTP_USER'),
        pass: this.configService.get('EMAIL_SMTP_PASS'),
      },
    });
  }

  async sendMail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: `"${this.configService.get('EMAIL_FROM_NAME')}" <${this.configService.get('EMAIL_FROM_ADDRESS')}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}
