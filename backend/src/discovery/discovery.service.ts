import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class DiscoveryService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  getMockMatches() {
    return [
      { id: '1', name: 'Amina', age: 24, location: 'Nairobi', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
      { id: '2', name: 'Wanjiru', age: 26, location: 'Mombasa', photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80' },
      { id: '3', name: 'Njeri', age: 23, location: 'Nakuru', photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80' },
      { id: '4', name: 'Fatuma', age: 28, location: 'Kisumu', photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' },
      { id: '5', name: 'Kemunto', age: 25, location: 'Eldoret', photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80' },
    ];
  }

  async getRecommendations(userId: string, filters?: { city?: string; county?: string; minAge?: number; maxAge?: number }) {
    const cacheKey = `discovery:rec:${userId}:${filters?.city || 'all'}:${filters?.minAge || 18}:${filters?.maxAge || 60}`;
    const cached = await this.cache.get<any[]>(cacheKey);
    if (cached) return cached;

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

    // Cache recommendations for 30 seconds
    await this.cache.set(cacheKey, profiles, 30);
    return profiles;
  }

  async sendLike(fromUserId: string, toUserId: string, isSuper = false) {
    const like = await this.prisma.like.upsert({
      where: { fromUserId_toUserId: { fromUserId, toUserId } },
      create: { fromUserId, toUserId, isSuper },
      update: { isSuper },
    });

    // Invalidate cached recommendations for this user
    await this.cache.delByPattern(`discovery:rec:${fromUserId}:*`);

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

