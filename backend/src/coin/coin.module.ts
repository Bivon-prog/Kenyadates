import { Module } from '@nestjs/common';
import { CoinService } from './coin.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CoinController } from './coin.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CoinController],
  providers: [CoinService],
  exports: [CoinService],
})
export class CoinModule {}
