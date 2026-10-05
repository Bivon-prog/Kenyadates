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

  async subscribeToPlan(userId: string, planId: string) {
    const plan = await this.prisma.membershipPlan.findUnique({
      where: { id: planId },
    });
    if (!plan) {
      throw new BadRequestException('Membership plan not found');
    }

    // Grant monthly bonus coins associated with the plan
    if (plan.monthlyCoins > 0) {
      await this.coinService.grantWelcomeCoins(userId, plan.monthlyCoins);
    }

    return {
      success: true,
      message: `Successfully subscribed to ${plan.name} membership!`,
      plan,
    };
  }
}
