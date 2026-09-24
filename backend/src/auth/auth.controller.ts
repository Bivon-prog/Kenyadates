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
  @ApiOperation({ summary: 'Login with Phone Number and Password' })
  login(@Body() body: { phoneNumber: string; password: string }) {
    return this.authService.login(body.phoneNumber, body.password);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify Phone OTP Code' })
  verifyOtp(@Body() body: { phoneNumber: string; otp: string }) {
    return this.authService.verifyOtp(body.phoneNumber, body.otp);
  }
}
