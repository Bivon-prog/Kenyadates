import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.init();
  }

  private async init() {
    try {
      // Generate a test account for local development
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });

      this.logger.log(`Ethereal Email initialized with account: ${testAccount.user}`);
    } catch (error) {
      this.logger.error('Failed to initialize Ethereal email', error);
    }
  }

  async sendVerificationEmail(to: string, token: string) {
    const url = `http://localhost:3000/verify-email?token=${token}`;
    
    const mailOptions = {
      from: '"KenyaDates" <noreply@kenyadates.com>',
      to,
      subject: 'Welcome to KenyaDates! Please verify your email',
      text: `Welcome to KenyaDates! Please verify your email by clicking the following link: ${url}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to KenyaDates! 💖</h2>
          <p>We are thrilled to have you.</p>
          <p>Please confirm your email address by clicking the button below:</p>
          <a href="${url}" style="background-color: #E8336D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Verify My Email</a>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Verification email sent: ${info.messageId}`);
      // Ethereal provides a URL to view the sent email in the browser
      this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending email to ${to}`, error);
      return false;
    }
  }
}
