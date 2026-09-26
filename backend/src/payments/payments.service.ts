import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private prisma: PrismaService) {}

  async mockStkPush(phoneNumber: string, amount: number) {
    this.logger.log(`Mock STK Push initiated for ${phoneNumber}, Amount: ${amount} KES`);
    return {
      success: true,
      message: 'STK Push prompt sent to phone. Enter your M-Pesa PIN to complete payment.',
      checkoutRequestId: `ws_CO_MOCK_${Date.now()}`,
    };
  }

  async initiateStkPush(userId: string, phoneNumber: string, amount: number, coins: number) {
    const formattedPhone = phoneNumber.startsWith('0')
      ? '254' + phoneNumber.substring(1)
      : phoneNumber.replace('+', '');

    const checkoutReqId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        phoneNumber: formattedPhone,
        amount,
        coinsPurchased: coins,
        checkoutReqId,
        status: 'PENDING',
      },
    });

    this.logger.log(`STK Push initiated for ${formattedPhone}, Amount: ${amount} KES, CheckoutId: ${checkoutReqId}`);

    return {
      success: true,
      message: 'STK Push prompt sent to phone. Enter your M-Pesa PIN to complete payment.',
      checkoutRequestId: checkoutReqId,
      transaction,
    };
  }

  async handleMpesaCallback(payload: any) {
    this.logger.log('Received M-Pesa Callback:', JSON.stringify(payload));
    const stkCallback = payload?.Body?.stkCallback;
    if (!stkCallback) return { status: 'ignored' };

    const checkoutReqId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;

    if (resultCode === 0) {
      const items = stkCallback.CallbackMetadata?.Item || [];
      const receiptItem = items.find((i: any) => i.Name === 'MpesaReceiptNumber');
      const mpesaReceiptNo = receiptItem?.Value || `MPESA_${Date.now()}`;

      const transaction = await this.prisma.transaction.update({
        where: { checkoutReqId },
        data: {
          status: 'COMPLETED',
          mpesaReceiptNo,
        },
      });

      await this.prisma.coinWallet.upsert({
        where: { userId: transaction.userId },
        create: {
          userId: transaction.userId,
          balance: transaction.coinsPurchased,
        },
        update: {
          balance: { increment: transaction.coinsPurchased },
        },
      });

      return { status: 'success', mpesaReceiptNo };
    } else {
      await this.prisma.transaction.update({
        where: { checkoutReqId },
        data: { status: 'FAILED' },
      });
      return { status: 'failed', resultCode };
    }
  }

  async getUserTransactions(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
