import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiscoveryService {
  constructor(private prisma: PrismaService) {}

  getMockMatches() {
    return [
      { id: '1', name: 'Amina', age: 24, location: 'Nairobi', photoUrl: 'https://i.pravatar.cc/300?img=1' },
      { id: '2', name: 'Wanjiru', age: 26, location: 'Mombasa', photoUrl: 'https://i.pravatar.cc/300?img=5' },
      { id: '3', name: 'Njeri', age: 23, location: 'Nakuru', photoUrl: 'https://i.pravatar.cc/300?img=9' },
      { id: '4', name: 'Fatuma', age: 28, location: 'Kisumu', photoUrl: 'https://i.pravatar.cc/300?img=12' },
      { id: '5', name: 'Kemunto', age: 25, location: 'Eldoret', photoUrl: 'https://i.pravatar.cc/300?img=16' },
    ];
  }

  async getRecommendations(userId: string, filters?: { city?: string; county?: string; minAge?: number; maxAge?: number }) {
    const existingLikes = await this.prisma.like.findMany({
      where: { fromUserId: userId },
      select: { toUserId: true },
    });
    const excludedIds = [userId, ...existingLikes.map((l) => l.toUserId)];

    const profiles = await this.prisma.profile.findMany({
      where: {
        userId: { notIn: excludedIds },
        city: filters?.city ? filters.city : undefined,
        age: {
          gte: filters?.minAge || 18,
          lte: filters?.maxAge || 60,
        },
      },
      include: { user: { select: { verificationStatus: true } } },
      take: 20,
    });

    return profiles;
  }

  async sendLike(fromUserId: string, toUserId: string, isSuper = false) {
    const like = await this.prisma.like.create({
      data: { fromUserId, toUserId, isSuper },
    });

    const reciprocal = await this.prisma.like.findUnique({
      where: { fromUserId_toUserId: { fromUserId: toUserId, toUserId: fromUserId } },
    });

    if (reciprocal) {
      const match = await this.prisma.match.create({
        data: {
          user1Id: fromUserId < toUserId ? fromUserId : toUserId,
          user2Id: fromUserId < toUserId ? toUserId : fromUserId,
        },
      });
      return { isMatch: true, match, like };
    }

    return { isMatch: false, like };
  }
}
