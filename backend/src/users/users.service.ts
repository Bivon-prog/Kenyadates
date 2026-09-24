import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, data: any) {
    return this.prisma.profile.update({
      where: { userId },
      data,
    });
  }

  async requestVerification(userId: string, selfieUrl: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { verificationStatus: 'PENDING' },
    });
  }
}
