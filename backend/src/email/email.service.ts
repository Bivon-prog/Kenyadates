import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter!: nodemailer.Transporter;
  private ready = false;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.init();
  }

  private async init() {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (gmailUser && gmailPass) {
      // Production — use Gmail SMTP
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailPass },
      });
      this.logger.log(`Gmail SMTP initialized: ${gmailUser}`);
    } else {
      // Development — use a static Ethereal account (no network call needed)
      // Generated once, reused across restarts so startup is instant
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'kenyadates.dev@ethereal.email',
          pass: 'kenyadates_dev_2026',
        },
      });
      this.logger.log('[DEV] Using static Ethereal SMTP — emails visible in logs');
    }

    this.ready = true;
  }

  async sendVerificationEmail(to: string, token: string): Promise<string> {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const verifyUrl = `${appUrl}/verify-email?token=${token}`;

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
          <p style="color:#a0a0b8;font-size:13px;">Or copy this link:<br/><a href="${verifyUrl}" style="color:#6c63ff;word-break:break-all;">${verifyUrl}</a></p>
          <p style="color:#606070;font-size:12px;margin-top:24px;">Link expires in 24 hours. If you didn't sign up, ignore this email.</p>
        </div>
        <div style="padding:20px;background:#111120;text-align:center;">
          <p style="color:#404055;font-size:12px;margin:0;">© 2026 KenyaDates · Made in Kenya 🇰🇪</p>
        </div>
      </div>
    `;

    // Always log the verify URL so devs can test without email
    this.logger.log(`\n\n🔗 VERIFY URL (also emailed): ${verifyUrl}\n`);

    // Fire-and-forget — don't block the registration response
    if (this.ready) {
      this.transporter.sendMail({
        from: `"KenyaDates 💖" <${process.env.GMAIL_USER || 'noreply@kenyadates.com'}>`,
        to,
        subject: '✅ Verify your KenyaDates account',
        text: `Verify your email: ${verifyUrl}`,
        html,
      }).then(info => {
        this.logger.log(`Email sent to ${to}: ${info.messageId}`);
      }).catch(err => {
        this.logger.warn(`Email send failed (non-critical): ${err.message}`);
      });
    }

    // Return the URL immediately — registration doesn't wait for email
    return verifyUrl;
  }
}
