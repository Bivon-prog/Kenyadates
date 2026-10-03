import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    // Retry connection up to 5 times with backoff — handles Supabase cold starts
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        await this.$connect();
        this.logger.log('✅ Database connected');
        return;
      } catch (err: any) {
        lastError = err;
        this.logger.warn(`DB connect attempt ${attempt}/5 failed: ${err.message.split('\n')[0]}`);
        if (attempt < 5) {
          await new Promise(r => setTimeout(r, attempt * 2000)); // 2s, 4s, 6s, 8s backoff
        }
      }
    }
    this.logger.error('❌ Could not connect to database after 5 attempts');
    // Don't throw — let the app start anyway and retry on first request
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
