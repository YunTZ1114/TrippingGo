import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly databaseService: DatabaseService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASS,
      },
      socketTimeout: 60000,
    });
  }

  async sendMail(to: string, userId: number, subject: string, text: string, html: string, code: string, type: string) {
    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    const currentTime = new Date();
    const expiresAt = new Date(currentTime);
    expiresAt.setDate(currentTime.getDate() + 1);

    try {
      await this.databaseService.mail.create({
        data: {
          userId,
          subject,
          type,
          html,
          expiresAt,
          code,
        },
      });

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  }

  async setMailIsUsed(mailCode: string): Promise<void> {
    console.log(mailCode);
    const mail = await this.databaseService.mail.findFirst({ where: { code: mailCode } });

    if (!mail) {
      throw new Error('Mail not found.');
    }

    await this.databaseService.mail.update({
      where: { id: mail.id },
      data: { isUsed: true },
    });
  }
}
