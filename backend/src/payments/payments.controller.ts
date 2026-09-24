import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('stkpush')
  @ApiOperation({ summary: 'Initiate Mock Safaricom M-Pesa STK Push Payment' })
  stkPushMock(
    @Body() body: { phoneNumber: string; amount: number; coins?: number },
  ) {
    return this.paymentsService.mockStkPush(body.phoneNumber, body.amount);
  }

  @Post('mpesa/stkpush')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Initiate Safaricom M-Pesa STK Push Payment' })
  stkPush(
    @Req() req: any,
    @Body() body: { phoneNumber: string; amount: number; coins: number },
  ) {
    return this.paymentsService.initiateStkPush(req.user.id, body.phoneNumber, body.amount, body.coins);
  }

  @Post('mpesa/callback')
  @ApiOperation({ summary: 'M-Pesa Daraja Callback Webhook URL' })
  callback(@Body() body: any) {
    return this.paymentsService.handleMpesaCallback(body);
  }

  @Get('history')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get User Coin Purchase Transactions' })
  getHistory(@Req() req: any) {
    return this.paymentsService.getUserTransactions(req.user.id);
  }
}
