import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CoinService } from '../coin/coin.service';

@Injectable()
export class MembershipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coinService: CoinService,
  ) {}

  async listPlans() {
    return this.prisma.membershipPlan.findMany({
      orderBy: { priceKsh: 'asc' },
    });
  }

  // Future feature: Upgrade membership
  // Since you don't have a specific `membership` field on `User` yet beyond a `Role`,
  // we would later add a user-membership mapping model. For now, returning plans is enough.
}
