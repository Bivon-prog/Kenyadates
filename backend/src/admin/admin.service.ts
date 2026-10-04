import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, VerificationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ─── DASHBOARD STATS ───────────────────────────────────────────
  async getDashboardStats() {
    const [
      totalUsers, activeToday, verifiedUsers, bannedUsers,
      totalMatches, totalMessages, totalRevenue, openReports,
      totalCoinsCirculating, newUsersThisWeek,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.profile.count({ where: { lastActiveAt: { gte: new Date(Date.now() - 86400000) } } }),
      this.prisma.user.count({ where: { verificationStatus: VerificationStatus.VERIFIED } }),
      this.prisma.user.count({ where: { role: Role.MODERATOR } }), // using MODERATOR as "restricted"
      this.prisma.match.count(),
      this.prisma.message.count(),
      this.prisma.transaction.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
      this.prisma.report.count({ where: { resolved: false } }),
      this.prisma.coinWallet.aggregate({ _sum: { balance: true } }),
      this.prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 86400000) } } }),
    ]);

    return {
      totalUsers,
      activeToday,
      verifiedUsers,
      bannedUsers,
      totalMatches,
      totalMessages,
      totalRevenue: totalRevenue._sum.amount ?? 0,
      openReports,
      totalCoinsCirculating: totalCoinsCirculating._sum.balance ?? 0,
      newUsersThisWeek,
    };
  }

  // ─── USER MANAGEMENT ───────────────────────────────────────────
  async getAllUsers(page = 1, limit = 20, search?: string, role?: string, verified?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { profile: { displayName: { contains: search, mode: 'insensitive' } } },
        { phoneNumber: { contains: search } },
      ];
    }
    if (role) where.role = role;
    if (verified === 'true') where.verificationStatus = VerificationStatus.VERIFIED;
    if (verified === 'false') where.verificationStatus = VerificationStatus.UNVERIFIED;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: { profile: true, wallet: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        phoneNumber: u.phoneNumber,
        role: u.role,
        emailVerified: u.emailVerified,
        verificationStatus: u.verificationStatus,
        createdAt: u.createdAt,
        profile: u.profile ? {
          displayName: u.profile.displayName,
          age: u.profile.age,
          gender: u.profile.gender,
          city: u.profile.city,
          county: u.profile.county,
          photos: u.profile.photos,
          interests: u.profile.interests,
        } : null,
        coins: u.wallet?.balance ?? 0,
      })),
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        wallet: { include: { transactions: { orderBy: { createdAt: 'desc' }, take: 10 } } },
        sentLikes: true,
        matches1: true,
        matches2: true,
        reportsReceived: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(dto: {
    email: string;
    password: string;
    displayName: string;
    age: number;
    gender: string;
    city: string;
    county: string;
    role?: Role;
    phoneNumber?: string;
  }) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 8);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phoneNumber: dto.phoneNumber || null,
        passwordHash,
        emailVerified: true,
        role: dto.role || Role.USER,
        profile: {
          create: {
            displayName: dto.displayName,
            age: dto.age,
            gender: dto.gender,
            city: dto.city,
            county: dto.county,
          },
        },
        wallet: { create: { balance: 150 } },
      },
      include: { profile: true },
    });
    return user;
  }

  async updateUserRole(id: string, role: Role) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({ where: { id }, data: { role } });
  }

  async verifyUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const updated = await this.prisma.user.update({
      where: { id },
      data: { verificationStatus: VerificationStatus.VERIFIED },
      include: { profile: true },
    });
    // Grant bonus coins for verification
    const wallet = await this.prisma.coinWallet.findUnique({ where: { userId: id } });
    if (wallet) {
      await this.prisma.coinWallet.update({
        where: { userId: id },
        data: {
          balance: { increment: 50 },
          transactions: {
            create: { type: 'BONUS', amount: 50, description: 'Verification badge coins' },
          },
        },
      });
    }
    return updated;
  }

  async banUser(id: string, reason?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    // We use MODERATOR role to signify "banned" state — keeps schema simple
    return this.prisma.user.update({
      where: { id },
      data: { role: Role.MODERATOR, emailVerified: false },
    });
  }

  async unbanUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { role: Role.USER, emailVerified: true },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }

  async adjustCoins(userId: string, amount: number, reason: string) {
    const wallet = await this.prisma.coinWallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    const newBalance = Math.max(0, wallet.balance + amount);
    await this.prisma.coinWallet.update({
      where: { userId },
      data: {
        balance: newBalance,
        transactions: {
          create: {
            type: amount > 0 ? 'BONUS' : 'REFUND',
            amount: Math.abs(amount),
            description: reason || (amount > 0 ? 'Admin bonus' : 'Admin deduction'),
          },
        },
      },
    });
    return { newBalance, adjusted: amount };
  }

  // ─── REPORTS ───────────────────────────────────────────────────
  async getReports(resolved?: boolean, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = resolved !== undefined ? { resolved } : {};
    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        include: {
          reporter: { include: { profile: true } },
          reportedUser: { include: { profile: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.report.count({ where }),
    ]);
    return { reports, total, page, pages: Math.ceil(total / limit) };
  }

  async resolveReport(id: string) {
    return this.prisma.report.update({ where: { id }, data: { resolved: true } });
  }

  // ─── COIN PACKAGES ─────────────────────────────────────────────
  async getCoinPackages() {
    return this.prisma.coinPackage.findMany({ orderBy: { priceKsh: 'asc' } });
  }

  async upsertCoinPackage(dto: { id?: string; name: string; priceKsh: number; coins: number; bonusCoins?: number }) {
    if (dto.id) {
      return this.prisma.coinPackage.update({
        where: { id: dto.id },
        data: { name: dto.name, priceKsh: dto.priceKsh, coins: dto.coins, bonusCoins: dto.bonusCoins ?? 0 },
      });
    }
    return this.prisma.coinPackage.create({
      data: { name: dto.name, priceKsh: dto.priceKsh, coins: dto.coins, bonusCoins: dto.bonusCoins ?? 0 },
    });
  }

  async deleteCoinPackage(id: string) {
    return this.prisma.coinPackage.delete({ where: { id } });
  }

  // ─── MEMBERSHIP PLANS ──────────────────────────────────────────
  async getMembershipPlans() {
    return this.prisma.membershipPlan.findMany({ orderBy: { priceKsh: 'asc' } });
  }

  async upsertMembershipPlan(dto: { id?: string; name: string; priceKsh: number; monthlyCoins: number; benefits?: any }) {
    if (dto.id) {
      return this.prisma.membershipPlan.update({
        where: { id: dto.id },
        data: { name: dto.name, priceKsh: dto.priceKsh, monthlyCoins: dto.monthlyCoins, benefits: dto.benefits },
      });
    }
    return this.prisma.membershipPlan.create({
      data: { name: dto.name, priceKsh: dto.priceKsh, monthlyCoins: dto.monthlyCoins, benefits: dto.benefits },
    });
  }

  // ─── TRANSACTIONS / PAYMENTS ───────────────────────────────────
  async getTransactions(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [txs, total] = await Promise.all([
      this.prisma.transaction.findMany({
        include: { user: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.transaction.count(),
    ]);
    return { transactions: txs, total, page, pages: Math.ceil(total / limit) };
  }

  // ─── SEED SUPER ADMIN ──────────────────────────────────────────
  async seedSuperAdmin(email: string, password: string, name: string) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) {
      // Promote to ADMIN if exists
      await this.prisma.user.update({ where: { email }, data: { role: Role.ADMIN } });
      return { message: `Promoted ${email} to ADMIN` };
    }
    const passwordHash = await bcrypt.hash(password, 8);
    const admin = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        emailVerified: true,
        role: Role.ADMIN,
        verificationStatus: VerificationStatus.VERIFIED,
        profile: {
          create: {
            displayName: name,
            age: 30,
            gender: 'Man',
            city: 'Nairobi',
            county: 'Nairobi',
          },
        },
        wallet: { create: { balance: 9999 } },
      },
    });
    return { message: `Super admin created: ${admin.email}` };
  }
}
