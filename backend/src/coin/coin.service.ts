import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CoinTransactionType } from '@prisma/client';

@Injectable()
export class CoinService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Ensure the user has a wallet; if not, create one.
   */
  private async ensureWallet(userId: string) {
    let wallet = await this.prisma.coinWallet.findUnique({
      where: { userId },
    });
    if (!wallet) {
      wallet = await this.prisma.coinWallet.create({
        data: { userId, balance: 0 },
      });
    }
    return wallet;
  }

  /** Grant welcome coins after email verification */
  async grantWelcomeCoins(userId: string, amount = 150) {
    const wallet = await this.ensureWallet(userId);
    // Prevent duplicate welcome grant
    const prior = await this.prisma.coinTransaction.findFirst({
      where: { walletId: wallet.id, type: CoinTransactionType.WELCOME },
    });
    if (prior) {
      return wallet;
    }
    const updated = await this.prisma.coinWallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: amount } },
    });
    await this.prisma.coinTransaction.create({
      data: {
        walletId: wallet.id,
        type: CoinTransactionType.WELCOME,
        amount,
        description: 'Welcome coins after email verification',
      },
    });
    return updated;
  }

  /** Purchase a coin package (mock payment) */
  async purchasePackage(userId: string, packageId: string) {
    const wallet = await this.ensureWallet(userId);
    const pkg = await this.prisma.coinPackage.findUnique({
      where: { id: packageId },
    });
    if (!pkg) {
      throw new BadRequestException('Invalid coin package');
    }
    const total = pkg.coins + (pkg.bonusCoins ?? 0);
    const updated = await this.prisma.coinWallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: total } },
    });
    await this.prisma.coinTransaction.create({
      data: {
        walletId: wallet.id,
        type: CoinTransactionType.PURCHASE,
        amount: total,
        description: `Purchase ${pkg.name}`,
      },
    });
    return updated;
  }

  /** Spend coins for any purpose */
  async spendCoins(userId: string, amount: number, type: CoinTransactionType, description: string) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }
    const wallet = await this.ensureWallet(userId);
    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient coin balance');
    }
    const updated = await this.prisma.coinWallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: amount } },
    });
    await this.prisma.coinTransaction.create({
      data: {
        walletId: wallet.id,
        type,
        amount,
        description,
      },
    });
    return updated;
  }

  async getBalance(userId: string) {
    const wallet = await this.prisma.coinWallet.findUnique({
      where: { userId },
    });
    return wallet?.balance ?? 0;
  }

  async listTransactions(userId: string) {
    const wallet = await this.prisma.coinWallet.findUnique({
      where: { userId },
    });
    if (!wallet) return [];
    return this.prisma.coinTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
    });
  }
}
