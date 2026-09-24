import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DiscoveryService } from './discovery.service';

@ApiTags('Discovery')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('discovery')
export class DiscoveryController {
  constructor(private discoveryService: DiscoveryService) {}

  @Get('recommendations')
  @ApiOperation({ summary: 'Get Recommendation Cards for Swipe Feed' })
  getRecommendations(@Req() req: any, @Query() query: any) {
    return this.discoveryService.getRecommendations(req.user.id, query);
  }

  @Post('like')
  @ApiOperation({ summary: 'Like or Superlike a User' })
  sendLike(@Req() req: any, @Body() body: { toUserId: string; isSuper?: boolean }) {
    return this.discoveryService.sendLike(req.user.id, body.toUserId, body.isSuper);
  }
}
