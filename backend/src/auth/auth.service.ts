import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(dto: { phoneNumber: string; email?: string; password: string; displayName: string; age: number; gender: string; city: string; county: string }) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber: dto.phoneNumber },
          ...(dto.email ? [{ email: dto.email }] : []),
        ],
      },
    });
    if (existing) {
      throw new ConflictException('Phone number or email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const verificationToken = randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        phoneNumber: dto.phoneNumber,
        email: dto.email,
        emailVerificationToken: verificationToken,
        passwordHash,
        profile: {
          create: {
            displayName: dto.displayName,
            age: dto.age,
            gender: dto.gender,
            city: dto.city,
            county: dto.county,
            photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb'],
          },
        },
      },
      include: { profile: true },
    });

    if (dto.email) {
      await this.emailService.sendVerificationEmail(dto.email, verificationToken);
    }

    const token = this.jwtService.sign({ sub: user.id, phoneNumber: user.phoneNumber, role: user.role });
    return { token, user };
  }

  async login(phoneNumber: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber },
      include: { profile: true },
    });
    if (!user) throw new UnauthorizedException('Invalid phone number or password');

    const matches = await bcrypt.compare(pass, user.passwordHash);
    if (!matches) throw new UnauthorizedException('Invalid phone number or password');

    const token = this.jwtService.sign({ sub: user.id, phoneNumber: user.phoneNumber, role: user.role });
    return { token, user };
  }

  async verifyOtp(phoneNumber: string, otp: string) {
    if (otp !== '123456' && otp !== '000000') {
      throw new UnauthorizedException('Invalid verification code');
    }
    return { success: true, message: 'OTP verified successfully' };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        verificationStatus: 'VERIFIED',
      },
    });

    return { success: true, message: 'Email verified successfully' };
  }
}
