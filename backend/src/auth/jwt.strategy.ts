import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'kenyadates_secret_key_2026',
    });
  }

  async validate(payload: { sub: string; phoneNumber: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { profile: true },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
