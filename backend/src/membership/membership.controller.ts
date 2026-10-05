import { Controller, Get, Post, Req, Body, UseGuards } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get('plans')
  async getPlans() {
    const plans = await this.membershipService.listPlans();
    return { plans };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('subscribe')
  async subscribe(@Req() req: any, @Body() body: { planId: string }) {
    return this.membershipService.subscribeToPlan(req.user.id, body.planId);
  }
}
