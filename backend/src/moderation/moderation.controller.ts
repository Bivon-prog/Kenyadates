import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ModerationService } from './moderation.service';

@ApiTags('Moderation')
@Controller('moderation')
export class ModerationController {
  constructor(private moderationService: ModerationService) {}

  @Post('report')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Report a Profile for inappropriate behavior' })
  reportUser(
    @Req() req: any,
    @Body() body: { reportedUserId: string; reason: string; description?: string },
  ) {
    return this.moderationService.reportUser(req.user.id, body.reportedUserId, body.reason, body.description);
  }

  @Get('admin/stats')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get High-level Platform Statistics for Admin' })
  getAdminStats() {
    return this.moderationService.getAdminStats();
  }
}
