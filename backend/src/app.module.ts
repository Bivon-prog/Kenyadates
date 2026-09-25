import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { ChatModule } from './chat/chat.module';
import { PaymentsModule } from './payments/payments.module';
import { ModerationModule } from './moderation/moderation.module';
import { EmailModule } from './email/email.module';
import { CoinModule } from './coin/coin.module';
import { MembershipModule } from './membership/membership.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    DiscoveryModule,
    ChatModule,
    PaymentsModule,
    ModerationModule,
    EmailModule,
    CoinModule,
    MembershipModule,
  ],
})
export class AppModule {}
