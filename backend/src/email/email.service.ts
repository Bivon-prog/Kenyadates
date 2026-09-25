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
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (gmailUser && gmailPass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailPass },
      });
      this.logger.log(`Gmail SMTP initialized: ${gmailUser}`);
    } else {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      this.logger.log(`[DEV] Ethereal Email: ${testAccount.user}`);
    }
  }

  async sendVerificationEmail(to: string, token: string): Promise<string> {
    const verifyUrl = `${process.env.APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#0f0f1a;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#E8336D,#6c63ff);padding:40px 32px;text-align:center;">
          <h1 style="color:white;margin:0;font-size:26px;font-weight:800;">KenyaDates 💖</h1>
        </div>
        <div style="padding:40px 32px;background:#1a1a2e;">
          <h2 style="color:white;margin:0 0 12px;">Verify your email ✅</h2>
          <p style="color:#a0a0b8;line-height:1.6;margin:0 0 32px;">Click the button below to activate your account and start meeting amazing people.</p>
          <div style="text-align:center;margin-bottom:32px;">
            <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#E8336D,#ff6b9d);color:white;text-decoration:none;padding:16px 40px;border-radius:50px;font-weight:700;font-size:16px;">
              ✅ Verify My Email
            </a>
          </div>
          <p style="color:#a0a0b8;font-size:13px;">Or copy this link: <span style="color:#6c63ff;">${verifyUrl}</span></p>
          <p style="color:#606070;font-size:12px;margin-top:24px;">Link expires in 24 hours. If you didn't sign up, ignore this email.</p>
        </div>
        <div style="padding:20px;background:#111120;text-align:center;">
          <p style="color:#404055;font-size:12px;margin:0;">© 2026 KenyaDates · Made in Kenya 🇰🇪</p>
        </div>
      </div>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: `"KenyaDates 💖" <${process.env.GMAIL_USER || 'noreply@kenyadates.com'}>`,
        to,
        subject: '✅ Verify your KenyaDates account',
        text: `Verify your email: ${verifyUrl}`,
        html,
      });
      this.logger.log(`Email sent: ${info.messageId}`);
      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) this.logger.log(`\n\n📧 DEV PREVIEW: ${preview}\n`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}`, err);
    }

    // Always return the URL so the API can return it to the client
    return verifyUrl;
  }
}
