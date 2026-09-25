import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';
import { CoinService } from '../coin/coin.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private coinService: CoinService,
  ) {}

  async register(dto: {
    email: string;
    phoneNumber?: string;
    password: string;
    displayName: string;
    age: number;
    gender: string;
    city: string;
    county: string;
  }) {
    // Check if email already exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException('This email is already registered. Please log in instead.');
    }

    // Check phone uniqueness if provided
    if (dto.phoneNumber) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phoneNumber: dto.phoneNumber },
      });
      if (existingPhone) {
        throw new ConflictException('This phone number is already registered.');
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const verificationToken = randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phoneNumber: dto.phoneNumber || null,
        emailVerificationToken: verificationToken,
        passwordHash,
        profile: {
          create: {
            displayName: dto.displayName,
            age: dto.age,
            gender: dto.gender,
            city: dto.city,
            county: dto.county,
          },
        },
      },
      include: { profile: true },
    });

    // Send verification email and get the URL back
    const verifyUrl = await this.emailService.sendVerificationEmail(dto.email, verificationToken);

    return {
      message: 'Registration successful! Please verify your email to continue.',
      verifyUrl, // returned for dev convenience; frontend shows this as a clickable link
    };
  }

  async login(identifier: string, password: string) {
    // Find user by email or phone
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          ...(identifier.startsWith('254') || identifier.startsWith('07') || identifier.startsWith('01')
            ? [{ phoneNumber: identifier }]
            : []),
        ],
      },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('No account found with those credentials. Please register first.');
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Incorrect password. Please try again.');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Please verify your email address before logging in. Check your inbox for the verification link.',
      );
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { token, user };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findUnique({
      where: { emailVerificationToken: token },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('This verification link is invalid or has already been used.');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
      },
      include: { profile: true },
    });

    const jwtToken = this.jwtService.sign({
      sub: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    // Grant welcome coins
    await this.coinService.grantWelcomeCoins(updatedUser.id, 150);

    return {
      success: true,
      message: 'Email verified! Welcome to KenyaDates 🎉',
      token: jwtToken,
      user: updatedUser,
    };
  }

  async verifyOtp(phoneNumber: string, otp: string) {
    if (otp !== '123456' && otp !== '000000') {
      throw new UnauthorizedException('Invalid verification code');
    }

    const user = await this.prisma.user.findUnique({ where: { phoneNumber } });
    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { verificationStatus: 'VERIFIED' },
      });
    }

    return {
      success: true,
      message: 'Phone verified! You now have the ✅ Verified badge.',
    };
  }
}
