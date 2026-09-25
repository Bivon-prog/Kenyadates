import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CoinService } from './coin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CoinTransactionType } from '@prisma/client';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  @Get('balance')
  async getBalance(@Req() req: any) {
    const balance = await this.coinService.getBalance(req.user.id);
    return { balance };
  }

  @Get('transactions')
  async getTransactions(@Req() req: any) {
    const transactions = await this.coinService.listTransactions(req.user.id);
    return { transactions };
  }

  // Temporary mock endpoint for purchasing packages
  @Post('purchase')
  async purchasePackage(@Req() req: any, @Body() body: { packageId: string }) {
    await this.coinService.purchasePackage(req.user.id, body.packageId);
    const balance = await this.coinService.getBalance(req.user.id);
    return { success: true, balance };
  }
}
