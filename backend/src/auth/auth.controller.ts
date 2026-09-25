import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new KenyaDates user' })
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Phone Number or Email' })
  login(@Body() body: { phoneNumber?: string; email?: string; password: string }) {
    const identifier = body.email || body.phoneNumber;
    if (!identifier) {
      throw new Error('Either phone number or email is required');
    }
    return this.authService.login(identifier, body.password);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify Phone OTP Code' })
  verifyOtp(@Body() body: { phoneNumber: string; otp: string }) {
    return this.authService.verifyOtp(body.phoneNumber, body.otp);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify Email Address using Token' })
  verifyEmail(@Body() body: { token: string }) {
    return this.authService.verifyEmail(body.token);
  }
}
