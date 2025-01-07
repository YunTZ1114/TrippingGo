import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MAIL_ADDRESS, MAIL_PASS, TEST_MAIL } from 'src/config';
import { DatabaseService } from 'src/database/database.service';
import { SendMailOptions } from 'src/types/email.type';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly databaseService: DatabaseService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: MAIL_ADDRESS,
        pass: MAIL_PASS,
      },
      socketTimeout: 60000,
    });
  }

  async sendMail({ recipient = TEST_MAIL, userId, subject, plainText, htmlContent, verificationCode, type }: SendMailOptions) {
    const mailOptions = {
      from: MAIL_ADDRESS,
      to: recipient,
      subject,
      text: plainText,
      html: htmlContent,
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
          html: htmlContent,
          expiresAt,
          code: verificationCode,
        },
      });

      const info = await this.transporter.sendMail(mailOptions);
      return 'Email sent: ' + info.response;
    } catch (error) {
      console.error('Error sending email: ', error);
      throw new HttpException('Failed to send email.', HttpStatus.INTERNAL_SERVER_ERROR);
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
