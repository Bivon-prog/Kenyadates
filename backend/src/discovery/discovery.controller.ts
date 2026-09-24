import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DiscoveryService } from './discovery.service';

@ApiTags('Discovery')
@Controller('discovery')
export class DiscoveryController {
  constructor(private discoveryService: DiscoveryService) {}

  @Get('matches')
  @ApiOperation({ summary: 'Get Mock Matches' })
  getMatches() {
    return this.discoveryService.getMockMatches();
  }

  @Get('recommendations')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get Recommendation Cards for Swipe Feed' })
  getRecommendations(@Req() req: any, @Query() query: any) {
    return this.discoveryService.getRecommendations(req.user.id, query);
  }

  @Post('like')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Like or Superlike a User' })
  sendLike(@Req() req: any, @Body() body: { toUserId: string; isSuper?: boolean }) {
    return this.discoveryService.sendLike(req.user.id, body.toUserId, body.isSuper);
  }
}
