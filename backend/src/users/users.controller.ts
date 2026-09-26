import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
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

  @Post('upload-photo')
  @ApiOperation({ summary: 'Upload Profile Photo to Supabase Storage' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadPhoto(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.uploadPhoto(req.user.id, file);
  }

  @Post('upload-voice')
  @ApiOperation({ summary: 'Upload Voice Note to Supabase Storage' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadVoiceNote(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.uploadVoiceNote(req.user.id, file);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Submit Selfie for Face Verification (Mock KYC)' })
  requestVerification(@Req() req: any, @Body() body: { selfieUrl?: string }) {
    return this.usersService.requestVerification(req.user.id, body.selfieUrl);
  }
}
