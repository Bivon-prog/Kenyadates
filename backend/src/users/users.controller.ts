import { Controller, Get, Put, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get Current Logged In User Profile' })
  getMe(@Req() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update User Profile Info' })
  updateProfile(@Req() req: any, @Body() body: any) {
    return this.usersService.updateProfile(req.user.id, body);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Submit Selfie Verification' })
  requestVerification(@Req() req: any, @Body() body: { selfieUrl: string }) {
    return this.usersService.requestVerification(req.user.id, body.selfieUrl);
  }
}
