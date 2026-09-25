import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CoinModule } from '../coin/coin.module';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    CoinModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'kenyadates_secret_key_2026',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
