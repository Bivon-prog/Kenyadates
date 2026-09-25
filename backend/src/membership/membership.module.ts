import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CoinModule } from '../coin/coin.module';

@Module({
  imports: [PrismaModule, CoinModule],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
