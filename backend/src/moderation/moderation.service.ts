import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModerationService {
  constructor(private prisma: PrismaService) {}

  async reportUser(reporterId: string, reportedUserId: string, reason: string, description?: string) {
    return this.prisma.report.create({
      data: {
        reporterId,
        reportedUserId,
        reason,
        description,
      },
    });
  }

  async getAdminStats() {
    const totalUsers = await this.prisma.user.count();
    const verifiedUsers = await this.prisma.user.count({ where: { verificationStatus: 'VERIFIED' } });
    const totalMatches = await this.prisma.match.count();
    const openReports = await this.prisma.report.count({ where: { resolved: false } });

    return { totalUsers, verifiedUsers, totalMatches, openReports };
  }
}
