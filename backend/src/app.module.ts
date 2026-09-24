import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { ChatModule } from './chat/chat.module';
import { PaymentsModule } from './payments/payments.module';
import { ModerationModule } from './moderation/moderation.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    DiscoveryModule,
    ChatModule,
    PaymentsModule,
    ModerationModule,
  ],
})
export class AppModule {}
